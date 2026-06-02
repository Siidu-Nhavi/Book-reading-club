const Book = require("../../models/Book.js");
const Rental = require("../../models/Rental.js");
const Reservation = require("../../models/Reservation.js");
const User = require("../../models/User.js");
const { getDueDate } = require("../../utils/rentalPricing.js");
const { getStripeClient } = require("../../services/stripeClient.js");

async function finalizeRentalFromReservation(reservation, paymentIntent) {
  const existingRental = await Rental.findOne({ paymentIntentId: paymentIntent.id });
  if (existingRental) {
    return existingRental;
  }

  if (reservation.status === "confirmed" && reservation.rental) {
    return Rental.findById(reservation.rental);
  }

  const rentedAt = new Date();
  const dueDate = getDueDate(rentedAt, reservation.rentalType, reservation.rentalDuration);

  const rental = await Rental.create({
    user: reservation.user,
    book: reservation.book,
    rentalType: reservation.rentalType,
    rentalDuration: reservation.rentalDuration,
    totalRentPrice: reservation.totalRentPrice,
    paymentStatus: "paid",
    paymentAmount: reservation.paymentAmount,
    paymentCurrency: reservation.paymentCurrency,
    paymentIntentId: paymentIntent.id,
    paymentConfirmedAt: rentedAt,
    depositAmount: reservation.depositAmount,
    rentedAt,
    dueDate,
    status: "active",
  });

  await Promise.all([
    Book.updateOne(
      { _id: reservation.book },
      {
        $set: {
          isAvailable: false,
          unavailabilityReason: "rented",
        },
      },
    ),
    User.updateOne({ _id: reservation.user }, { $inc: { activeRentalsCount: 1 } }),
    Reservation.updateOne(
      { _id: reservation._id },
      {
        $set: {
          status: "confirmed",
          confirmedAt: rentedAt,
          rental: rental._id,
        },
      },
    ),
  ]);

  return rental;
}

async function handleStripeWebhook(req, res) {
  console.log("Received Stripe webhook event");
  const stripe = getStripeClient();
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: "STRIPE_WEBHOOK_SECRET is not configured" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      const reservationId = paymentIntent?.metadata?.reservationId;
      let reservation = null;

      if (reservationId) {
        reservation = await Reservation.findById(reservationId);
      }

      if (!reservation) {
        reservation = await Reservation.findOne({ paymentIntentId: paymentIntent.id });
      }

      if (!reservation) {
        console.warn("Stripe webhook: reservation not found", {
          paymentIntentId: paymentIntent.id,
          reservationId: reservationId || null,
        });
        return res.status(200).json({ received: true });
      }

      if (reservation.status === "confirmed" && reservation.rental) {
        return res.status(200).json({ received: true });
      }

      if (!reservation.paymentIntentId) {
        await Reservation.updateOne(
          { _id: reservation._id },
          { $set: { paymentIntentId: paymentIntent.id } },
        );
      }

      await finalizeRentalFromReservation(reservation, paymentIntent);
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Finalize rental webhook error:", error);
      return res.status(500).json({ error: "Unable to finalize rental" });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;

    try {
      await Reservation.updateOne(
        { paymentIntentId: paymentIntent.id, status: { $in: ["reserved", "expired"] } },
        { $set: { status: "canceled" } },
      );
    } catch (error) {
      console.error("Stripe payment failed handling error:", error);
    }
  }

  return res.status(200).json({ received: true });
}

module.exports = { handleStripeWebhook };
