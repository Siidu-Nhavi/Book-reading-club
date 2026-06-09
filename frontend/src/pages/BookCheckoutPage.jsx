import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { paymentsApi, rentalsApi } from "../api";
import RentalDurationSelector from "../components/books/RentalDurationSelector";
import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import useBookById from "../hooks/useBookById";
import usePageTitle from "../hooks/usePageTitle";
import {
  formatBookPrice,
  getBookDepositAmount,
  getRentalTotal,
  getTotalRentPrice,
} from "../utils/books";
import {
  PUBLIC_BUTTON_GHOST_SX,
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_SURFACE_SX,
  PUBLIC_UI,
} from "../utils/publicUi";

const RENTAL_LIMITS = {
  daily: { min: 1, max: 30, defaultDuration: 7 },
  weekly: { min: 1, max: 4, defaultDuration: 1 },
  monthly: { min: 1, max: 3, defaultDuration: 1 },
};

function getInitialRentalType(searchParams) {
  const value = String(searchParams.get("rentalType") || "daily").toLowerCase();
  return RENTAL_LIMITS[value] ? value : "daily";
}

function getInitialRentalDuration(searchParams, rentalType) {
  const parsed = Number.parseInt(searchParams.get("rentalDuration"), 10);
  const limits = RENTAL_LIMITS[rentalType] || RENTAL_LIMITS.daily;

  if (!Number.isInteger(parsed) || parsed < limits.min || parsed > limits.max) {
    return limits.defaultDuration;
  }

  return parsed;
}

function getPaymentSettingsPath(bookId) {
  return `/dashboard/profile/payment?return=${encodeURIComponent(`/books/${bookId}`)}&notice=payment_required`;
}

function getUnavailableBookPath(bookId) {
  return `/books/${bookId}?error=unavailable`;
}

export default function BookCheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRentalType = useMemo(() => getInitialRentalType(searchParams), [searchParams]);
  const [rentalType, setRentalType] = useState(initialRentalType);
  const [rentalDuration, setRentalDuration] = useState(() => getInitialRentalDuration(searchParams, initialRentalType));
  const [preview, setPreview] = useState(null);
  const [methods, setMethods] = useState([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState("");
  const [isMethodsLoading, setIsMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { book, loading: isBookLoading, error: bookError } = useBookById(id);

  usePageTitle(book ? `Checkout - ${book.title} - BookNest` : "Checkout - BookNest");

  useEffect(() => {
    if (book && !book.isAvailable) {
      navigate(getUnavailableBookPath(id), { replace: true });
    }
  }, [book, id, navigate]);

  useEffect(() => {
    setSearchParams(
      { rentalType, rentalDuration: String(rentalDuration) },
      { replace: true },
    );
  }, [rentalDuration, rentalType, setSearchParams]);

  useEffect(() => {
    let active = true;

    const loadMethods = async () => {
      try {
        setIsMethodsLoading(true);
        setMethodsError("");
        const response = await paymentsApi.getPaymentMethods();

        if (!active) {
          return;
        }

        const savedMethods = response?.methods || [];
        const defaultId = response?.defaultPaymentMethodId || "";
        const usableDefaultId = savedMethods.some((method) => method.id === defaultId) ? defaultId : "";
        setMethods(savedMethods);
        setDefaultPaymentMethodId(usableDefaultId);
        setSelectedPaymentMethodId(usableDefaultId);

        if (savedMethods.length === 0) {
          navigate(getPaymentSettingsPath(id), { replace: true });
        }
      } catch (error) {
        if (active) {
          setMethodsError(error.message || "Unable to load saved payment methods.");
        }
      } finally {
        if (active) {
          setIsMethodsLoading(false);
        }
      }
    };

    loadMethods();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!book) {
      return undefined;
    }

    let active = true;

    const loadPreview = async () => {
      try {
        setCheckoutError("");
        const response = await rentalsApi.previewRental(book._id, rentalType, rentalDuration);

        if (!active) {
          return;
        }

        setPreview(response?.pricing || null);

        if (!response?.allowed) {
          setCheckoutError(response?.message || "This book is not available for the selected rental.");
        }
      } catch (error) {
        if (active) {
          setCheckoutError(error.message || "Unable to preview this rental.");
        }
      }
    };

    loadPreview();

    return () => {
      active = false;
    };
  }, [book, rentalDuration, rentalType]);

  const totalRentPrice = useMemo(
    () => (book ? getTotalRentPrice(book, rentalType, rentalDuration) : 0),
    [book, rentalDuration, rentalType],
  );
  const depositAmount = useMemo(() => (book ? getBookDepositAmount(book) : 0), [book]);
  const totalDue = useMemo(
    () => (book ? getRentalTotal(book, rentalType, rentalDuration) : 0),
    [book, rentalDuration, rentalType],
  );

  const handleRentalTypeChange = (nextType) => {
    setRentalType(nextType);
    setRentalDuration(RENTAL_LIMITS[nextType]?.defaultDuration || 1);
  };

  const handleConfirmRental = async () => {
    if (!book || !selectedPaymentMethodId) {
      return;
    }

    try {
      setIsProcessing(true);
      setCheckoutError("");
      setCheckoutMessage("");

      const response = await rentalsApi.rentBook(
        book._id,
        rentalType,
        rentalDuration,
        selectedPaymentMethodId,
      );
      const status = response?.payment?.status || "processing";
      setCheckoutMessage(
        status === "succeeded"
          ? "Payment captured. Your rental is ready."
          : "Payment is processing. Your rental will update shortly.",
      );

      setTimeout(() => {
        navigate("/dashboard/rentals");
      }, 1200);
    } catch (error) {
      if (error?.status === 409) {
        navigate(getUnavailableBookPath(book._id), { replace: true });
        return;
      }

      if (error?.code === "payment_method_required" || error?.code === "authentication_required") {
        setCheckoutError("Your payment method needs an update. Redirecting to payment settings...");
        setTimeout(() => {
          navigate(getPaymentSettingsPath(book._id), { replace: true });
        }, 900);
        return;
      }

      setCheckoutError(error.message || "Unable to confirm this rental right now.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isBookLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3.5, md: 6 } }}>
        <LoadingSkeleton variant="page" />
      </Container>
    );
  }

  if (bookError || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3.5, md: 6 } }}>
        <EmptyState
          title="We could not load checkout"
          description={bookError || "This book may have been removed."}
          actionLabel="Back to Catalogue"
          actionTo="/books"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3.5, md: 6 } }}>
      <Stack spacing={3}>
        <Button
          variant="text"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(`/books/${book._id}`)}
          sx={{ alignSelf: "flex-start", color: PUBLIC_UI.primary, textTransform: "none", fontWeight: 700 }}
        >
          Back to book
        </Button>

        <Box>
          <Typography variant="h3" sx={{ color: PUBLIC_UI.text, fontWeight: 800, fontSize: { xs: "2rem", md: "2.7rem" } }}>
            Confirm Rental
          </Typography>
          <Typography sx={{ color: PUBLIC_UI.muted, mt: 0.8 }}>
            Confirm payment to start your rental.
          </Typography>
        </Box>

        {checkoutError ? <Alert severity="warning">{checkoutError}</Alert> : null}
        {methodsError ? <Alert severity="error">{methodsError}</Alert> : null}
        {checkoutMessage ? <Alert severity="success">{checkoutMessage}</Alert> : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: 2.5,
            alignItems: "start",
          }}
        >
          <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: { xs: 2.2, md: 3 } }}>
            <Stack spacing={2.2}>
              <Box>
                <Typography variant="overline" sx={{ color: PUBLIC_UI.muted, fontWeight: 800 }}>
                  Rental summary
                </Typography>
                <Typography variant="h5" sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
                  {book.title}
                </Typography>
                <Typography sx={{ color: PUBLIC_UI.muted }}>by {book.author}</Typography>
              </Box>

              <RentalDurationSelector
                rentalType={rentalType}
                rentalDuration={rentalDuration}
                onTypeChange={handleRentalTypeChange}
                onDurationChange={setRentalDuration}
              />

              <Divider />

              <Stack spacing={1.2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ color: PUBLIC_UI.muted }}>Total rent</Typography>
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 700 }}>
                    {formatBookPrice(preview?.totalRentPrice ?? totalRentPrice)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ color: PUBLIC_UI.muted }}>Security deposit</Typography>
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 700 }}>
                    {formatBookPrice(preview?.depositAmount ?? depositAmount)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>Total due now</Typography>
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
                    {formatBookPrice(preview?.total ?? totalDue)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: { xs: 2.2, md: 3 } }}>
            <Stack spacing={2.2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <CreditCardRoundedIcon sx={{ color: PUBLIC_UI.primary }} />
                <Typography variant="h5" sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
                  Saved payment methods
                </Typography>
              </Stack>

              <Divider />

              {isMethodsLoading ? (
                <Typography sx={{ color: PUBLIC_UI.muted }}>Loading saved cards...</Typography>
              ) : methods.length > 0 ? (
                <RadioGroup
                  value={selectedPaymentMethodId}
                  onChange={(event) => setSelectedPaymentMethodId(event.target.value)}
                >
                  <Stack spacing={1.2}>
                    {methods.map((method) => {
                      const isDefault = method.id === defaultPaymentMethodId;
                      return (
                        <Paper
                          key={method.id}
                          elevation={0}
                          sx={{
                            borderRadius: 2,
                            border: `1px solid ${
                              selectedPaymentMethodId === method.id ? PUBLIC_UI.primary : PUBLIC_UI.border
                            }`,
                            bgcolor: selectedPaymentMethodId === method.id ? PUBLIC_UI.primarySoft : PUBLIC_UI.surface,
                            px: 1.4,
                            py: 1,
                          }}
                        >
                          <FormControlLabel
                            value={method.id}
                            control={<Radio />}
                            sx={{ m: 0, width: "100%", alignItems: "center" }}
                            label={
                              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 1.5, alignItems: "center" }}>
                                <Box>
                                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                                    <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
                                      {method.brand ? method.brand.toUpperCase() : "Card"} **** {method.last4}
                                    </Typography>
                                    {isDefault ? <Chip size="small" label="Default" sx={{ fontWeight: 800 }} /> : null}
                                  </Stack>
                                  <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
                                    exp {method.expMonth}/{String(method.expYear).slice(-2)}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </Paper>
                      );
                    })}
                  </Stack>
                </RadioGroup>
              ) : (
                <Typography sx={{ color: PUBLIC_UI.muted }}>
                  No saved cards found. Redirecting to payment settings...
                </Typography>
              )}

              <Button
                variant="contained"
                disabled={isProcessing || Boolean(checkoutError) || !selectedPaymentMethodId}
                onClick={handleConfirmRental}
                sx={{ ...PUBLIC_BUTTON_PRIMARY_SX, borderRadius: 999, py: 1.15 }}
              >
                {isProcessing ? "Processing..." : "Confirm Rental"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate(`/books/${book._id}`)}
                sx={{ ...PUBLIC_BUTTON_GHOST_SX, borderRadius: 999, py: 1.05 }}
              >
                Back to book
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}
