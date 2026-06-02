const mongoose = require("mongoose");
const Reservation = require("../../models/Reservation.js");
const { evaluateRentalEligibility } = require("../../services/rentalFinanceService.js");
const { roundCurrency } = require("../../utils/rentalPricing.js");
const { getStripeClient } = require("../../services/stripeClient.js");
const { getOrCreateStripeCustomer } = require("../../services/stripeCustomer.js");

const RESERVATION_TTL_MS = 5 * 60 * 1000;

const DURATION_LIMITS = {
  daily: { min: 1, max: 30 },
  weekly: { min: 1, max: 4 },
  monthly: { min: 1, max: 3 },
};

function normalizeRentalInput(body = {}) {
  const rentalType = String(body.rentalType || "daily").trim().toLowerCase();
  const rentalDuration = Number.parseInt(body.rentalDuration, 10);
  return { rentalType, rentalDuration };
}

function validateRentalInput({ rentalType, rentalDuration }) {
  if (!DURATION_LIMITS[rentalType]) {
    return "rentalType must be daily, weekly, or monthly";
  }

  const bounds = DURATION_LIMITS[rentalType];

  if (!Number.isInteger(rentalDuration) || rentalDuration < bounds.min || rentalDuration > bounds.max) {
    return `rentalDuration must be between ${bounds.min} and ${bounds.max} for ${rentalType} rentals`;
  }

  return "";
}

function buildReservationPayload(reservation) {
  return {
    _id: reservation._id,
    book: reservation.book,
    rentalType: reservation.rentalType,
    rentalDuration: reservation.rentalDuration,
    totalRentPrice: reservation.totalRentPrice,
    depositAmount: reservation.depositAmount,
    paymentAmount: reservation.paymentAmount,
    paymentCurrency: reservation.paymentCurrency,
    paymentIntentId: reservation.paymentIntentId,
    expiresAt: reservation.expiresAt,
    status: reservation.status,
  };
}

function resolvePaymentError(error) {
  if (!error) {
    return null;
  }

  const code = error.code || "";

  if (code === "authentication_required" || code === "card_declined") {
    return {
      status: 402,
      code: "authentication_required",
      message: "Payment method requires update or verification",
    };
  }

  if (error.type === "StripeCardError") {
    return {
      status: 402,
      code: "authentication_required",
      message: error.message || "Payment method requires update",
    };
  }

  return null;
}

async function getDefaultPaymentMethod({ stripe, customer }) {
  const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method || null;

  if (!defaultPaymentMethodId) {
    return null;
  }

  return defaultPaymentMethodId;
}

async function createOffSessionPaymentIntent({
  stripe,
  reservation,
  customerId,
  paymentMethodId,
}) {
  const amountInPaise = Math.round(Number(reservation.paymentAmount) * 100);
  const idempotencyKey = `reservation:${reservation._id}:${Date.now()}`;

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: amountInPaise,
      currency: "inr",
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      off_session: true,
      metadata: {
        reservationId: String(reservation._id),
        userId: String(reservation.user),
        bookId: String(reservation.book),
        rentalType: reservation.rentalType,
        rentalDuration: String(reservation.rentalDuration),
      },
    },
    { idempotencyKey },
  );

  reservation.paymentIntentId = paymentIntent.id;
  reservation.idempotencyKey = idempotencyKey;
  await reservation.save();

  return paymentIntent;
}

async function rentBook(req, res) {
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid bookId is required" });
  }

  const rentalInput = normalizeRentalInput(req.body);
  const validationError = validateRentalInput(rentalInput);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const eligibility = await evaluateRentalEligibility({
      userId: req.user._id,
      bookId,
      rentalType: rentalInput.rentalType,
      rentalDuration: rentalInput.rentalDuration,
    });

    if (!eligibility.allowed) {
      return res.status(eligibility.status || 400).json({ error: eligibility.message });
    }

    const stripe = getStripeClient();
    const customer = await getOrCreateStripeCustomer(req.user, stripe);
    const defaultPaymentMethodId = await getDefaultPaymentMethod({ stripe, customer });

    if (!defaultPaymentMethodId) {
      return res.status(400).json({
        error: "Payment method required",
        code: "payment_method_required",
      });
    }

    const now = new Date();
    const activeReservation = await Reservation.findOne({
      book: bookId,
      status: "reserved",
      expiresAt: { $gt: now },
    });

    if (activeReservation) {
      const isSameUser = String(activeReservation.user) === String(req.user._id);
      const isSameRental =
        activeReservation.rentalType === rentalInput.rentalType &&
        activeReservation.rentalDuration === rentalInput.rentalDuration;

      if (!isSameUser) {
        return res.status(409).json({
          error: "Book is currently reserved",
          reservationId: activeReservation._id,
          expiresAt: activeReservation.expiresAt,
        });
      }

      if (!isSameRental) {
        return res.status(409).json({
          error: "You already have a reservation for this book with different rental options",
          reservationId: activeReservation._id,
          expiresAt: activeReservation.expiresAt,
        });
      }

      try {
        if (activeReservation.paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            activeReservation.paymentIntentId,
          );
          const status = paymentIntent?.status || "";

          if (status === "succeeded" || status === "processing") {
            return res.status(200).json({
              message: "Reservation already paid",
              reservation: buildReservationPayload(activeReservation),
              payment: {
                status,
                amount: activeReservation.paymentAmount,
                currency: activeReservation.paymentCurrency,
              },
              isExisting: true,
            });
          }

          if (status === "requires_action" || status === "requires_payment_method") {
            activeReservation.paymentIntentId = "";
            await activeReservation.save();
            return res.status(402).json({
              error: "Payment method requires update or verification",
              code: "authentication_required",
            });
          }
        }

        const paymentIntent = await createOffSessionPaymentIntent({
          stripe,
          reservation: activeReservation,
          customerId: customer.id,
          paymentMethodId: defaultPaymentMethodId,
        });

        return res.status(200).json({
          message: "Reservation payment initiated",
          reservation: buildReservationPayload(activeReservation),
          payment: {
            status: paymentIntent.status,
            amount: activeReservation.paymentAmount,
            currency: activeReservation.paymentCurrency,
          },
          isExisting: true,
        });
      } catch (error) {
        const paymentError = resolvePaymentError(error);
        if (paymentError) {
          return res.status(paymentError.status).json({
            error: paymentError.message,
            code: paymentError.code,
          });
        }
        console.error("Fetch reservation payment intent error:", error);
        return res.status(500).json({ error: "Unable to fetch reservation payment details" });
      }
    }

    const total = roundCurrency(eligibility.totalRentPrice + eligibility.depositAmount);
    const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MS);
    const reservation = await Reservation.create({
      user: req.user._id,
      book: bookId,
      rentalType: rentalInput.rentalType,
      rentalDuration: rentalInput.rentalDuration,
      totalRentPrice: eligibility.totalRentPrice,
      depositAmount: eligibility.depositAmount,
      paymentAmount: total,
      paymentCurrency: "INR",
      expiresAt,
    });

    let paymentIntent;

    try {
      paymentIntent = await createOffSessionPaymentIntent({
        stripe,
        reservation,
        customerId: customer.id,
        paymentMethodId: defaultPaymentMethodId,
      });
    } catch (error) {
      const paymentError = resolvePaymentError(error);
      if (paymentError) {
        return res.status(paymentError.status).json({
          error: paymentError.message,
          code: paymentError.code,
        });
      }
      await Reservation.deleteOne({ _id: reservation._id });
      throw error;
    }

    return res.status(201).json({
      message: "Reservation created",
      reservation: buildReservationPayload(reservation),
      payment: {
        status: paymentIntent.status,
        amount: reservation.paymentAmount,
        currency: reservation.paymentCurrency,
      },
    });
  } catch (error) {
    console.error("Rent book error:", error);
    return res.status(500).json({ error: "Unable to create reservation" });
  }
}

async function previewRental(req, res) {
  const { bookId } = req.query;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid bookId is required" });
  }

  const rentalInput = normalizeRentalInput(req.query);
  const validationError = validateRentalInput(rentalInput);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const eligibility = await evaluateRentalEligibility({
      userId: req.user._id,
      bookId,
      rentalType: rentalInput.rentalType,
      rentalDuration: rentalInput.rentalDuration,
    });

    return res.status(200).json({
      allowed: Boolean(eligibility.allowed),
      message: eligibility.message || "",
      pricing: eligibility.allowed
        ? {
            totalRentPrice: eligibility.totalRentPrice,
            depositAmount: eligibility.depositAmount,
            total: eligibility.total,
          }
        : {
            totalRentPrice: eligibility.totalRentPrice || 0,
            depositAmount: eligibility.depositAmount || 0,
            total: eligibility.total || 0,
          },
    });
  } catch (error) {
    console.error("Preview rental error:", error);
    return res.status(500).json({ error: "Unable to preview rental" });
  }
}

module.exports = { rentBook, previewRental };
