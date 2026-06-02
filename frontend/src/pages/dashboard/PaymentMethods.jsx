import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Alert, Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentsApi } from "../../api";
import usePageTitle from "../../hooks/usePageTitle";
import { BOOKNEST_COLORS } from "../../utils/profile";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

function SetupCardForm({ clientSecret, onComplete, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        const message = error.message || "Unable to save payment method.";
        setFormError(message);
        if (onError) {
          onError(message);
        }
        return;
      }

      if (setupIntent?.status === "succeeded" || setupIntent?.status === "processing") {
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const fallbackMessage = "Payment method needs attention. Please try again.";
      setFormError(fallbackMessage);
      if (onError) {
        onError(fallbackMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1.6}>
        <PaymentElement />
        {formError ? <Alert severity="warning">{formError}</Alert> : null}
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || !elements || isSubmitting}
          sx={{ borderRadius: 999, py: 1.1, fontWeight: 700 }}
        >
          {isSubmitting ? "Saving..." : "Save Payment Method"}
        </Button>
      </Stack>
    </form>
  );
}

export default function PaymentMethods() {
  usePageTitle("Payment Methods — BookNest");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [methods, setMethods] = useState([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isCreatingSetupIntent, setIsCreatingSetupIntent] = useState(false);
  const [notice, setNotice] = useState("");

  const returnPath = useMemo(() => searchParams.get("return") || "", [searchParams]);

  const loadMethods = async () => {
    try {
      setIsLoading(true);
      setPageError("");
      const response = await paymentsApi.getPaymentMethods();
      setMethods(response?.methods || []);
      setDefaultPaymentMethodId(response?.defaultPaymentMethodId || "");
    } catch (error) {
      setPageError(error.message || "Unable to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const handleCreateSetupIntent = async () => {
    try {
      setIsCreatingSetupIntent(true);
      setActionError("");
      const response = await paymentsApi.createSetupIntent();
      setClientSecret(response?.clientSecret || "");
    } catch (error) {
      setActionError(error.message || "Unable to start payment setup");
    } finally {
      setIsCreatingSetupIntent(false);
    }
  };

  const handleSetDefault = async (paymentMethodId) => {
    try {
      setActionError("");
      await paymentsApi.setDefaultPaymentMethod(paymentMethodId);
      await loadMethods();
      setNotice("Default payment method updated.");
    } catch (error) {
      setActionError(error.message || "Unable to update default payment method");
    }
  };

  const handleRemove = async (paymentMethodId) => {
    try {
      setActionError("");
      await paymentsApi.removePaymentMethod(paymentMethodId);
      await loadMethods();
      setNotice("Payment method removed.");
    } catch (error) {
      setActionError(error.message || "Unable to remove payment method");
    }
  };

  const handleSetupComplete = async () => {
    await loadMethods();
    setClientSecret("");
    setNotice("Payment method saved.");

    if (returnPath) {
      navigate(returnPath);
    }
  };

  const stripeOptions = useMemo(() => {
    if (!clientSecret) {
      return null;
    }

    return {
      clientSecret,
      appearance: {
        theme: "stripe",
      },
    };
  }, [clientSecret]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" sx={{ color: BOOKNEST_COLORS.secondaryBrown, fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
          Payment Methods
        </Typography>
        <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
          Save a card to enable one-tap rentals and avoid interruptions at checkout.
        </Typography>
      </Box>

      {pageError ? <Alert severity="error">{pageError}</Alert> : null}
      {actionError ? <Alert severity="warning">{actionError}</Alert> : null}
      {notice ? <Alert severity="success">{notice}</Alert> : null}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: `1px solid ${BOOKNEST_COLORS.border}`,
          backgroundColor: BOOKNEST_COLORS.card,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CreditCardRoundedIcon sx={{ color: BOOKNEST_COLORS.primaryBrown }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
              Saved Cards
            </Typography>
          </Stack>
          <Divider />
          {isLoading ? (
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              Loading saved cards...
            </Typography>
          ) : methods.length === 0 ? (
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              No saved cards yet. Add a payment method below to start renting.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {methods.map((method) => {
                const isDefault = method.id === defaultPaymentMethodId;
                return (
                  <Paper
                    key={method.id}
                    elevation={0}
                    sx={{
                      p: 1.6,
                      borderRadius: 2.5,
                      border: `1px solid ${BOOKNEST_COLORS.border}`,
                      backgroundColor: BOOKNEST_COLORS.soft,
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { sm: "center" } }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
                          {method.brand ? method.brand.toUpperCase() : "Card"} •••• {method.last4}
                        </Typography>
                        <Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted }}>
                          exp {method.expMonth}/{String(method.expYear).slice(-2)} • {method.country || ""}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        {isDefault ? (
                          <Chip label="Default" size="small" sx={{ fontWeight: 700 }} />
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSetDefault(method.id)}
                            startIcon={<SaveRoundedIcon fontSize="small" />}
                            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          size="small"
                          color="error"
                          variant="text"
                          onClick={() => handleRemove(method.id)}
                          startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                          sx={{ textTransform: "none", fontWeight: 700 }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: `1px solid ${BOOKNEST_COLORS.border}`,
          backgroundColor: BOOKNEST_COLORS.card,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
            Add a new card
          </Typography>
          <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
            Your card details are encrypted and stored securely with Stripe.
          </Typography>
          {!clientSecret ? (
            <Button
              variant="contained"
              onClick={handleCreateSetupIntent}
              disabled={isCreatingSetupIntent}
              sx={{ borderRadius: 999, py: 1.1, fontWeight: 700, alignSelf: "flex-start" }}
            >
              {isCreatingSetupIntent ? "Preparing..." : "Add Payment Method"}
            </Button>
          ) : stripePromise && stripeOptions ? (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <SetupCardForm
                clientSecret={clientSecret}
                onComplete={handleSetupComplete}
                onError={setActionError}
              />
            </Elements>
          ) : (
            <Alert severity="warning">
              Stripe publishable key is missing. Add VITE_STRIPE_PUBLISHABLE_KEY to continue.
            </Alert>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
