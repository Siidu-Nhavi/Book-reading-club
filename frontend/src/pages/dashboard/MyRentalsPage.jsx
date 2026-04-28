import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { rentalsApi } from "../../api";
import usePageTitle from "../../hooks/usePageTitle";
import { formatBookPrice } from "../../utils/books";
import { BOOKNEST_COLORS } from "../../utils/profile";

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

function RatingInput({ value, onChange }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
      {Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = index + 1;
        const active = ratingValue <= value;

        return (
          <Button
            key={`return-rating-${ratingValue}`}
            onClick={() => onChange(ratingValue)}
            sx={{
              minWidth: 0,
              p: 0.2,
              color: active ? "#f59e0b" : "#d1d5db",
            }}
          >
            <StarRoundedIcon />
          </Button>
        );
      })}
    </Stack>
  );
}

export default function MyRentalsPage() {
  usePageTitle("My Rentals - BookNest");
  const [data, setData] = useState({ rentals: [], alerts: [], wallet: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRental, setSelectedRental] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const loadRentals = async () => {
    const response = await rentalsApi.getMyRentals({ limit: 50 });
    setData(response);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await rentalsApi.getMyRentals({ limit: 50 });

        if (active) {
          setData(response);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load rentals");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
            My Rentals
          </Typography>
          <Typography sx={{ color: BOOKNEST_COLORS.muted }}>
            Track due dates, overdue charges, deposit holds, damage outcomes, and refund release status.
          </Typography>
          <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.primaryBrown }}>
            Wallet balance: {formatBookPrice(Number(data.wallet?.balance || 0))}
          </Typography>
          <Typography sx={{ color: BOOKNEST_COLORS.muted }}>
            Held refundable deposits: {formatBookPrice(Number(data.wallet?.heldRefundTotal || 0))}
          </Typography>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}

      {Array.isArray(data.alerts) && data.alerts.length > 0 ? (
        <Stack spacing={1.2}>
          {data.alerts.map((alert) => (
            <Alert key={alert.rentalId} severity={alert.type === "overdue" ? "warning" : "info"}>
              {alert.message}
            </Alert>
          ))}
        </Stack>
      ) : null}

      {isLoading ? (
        <Typography sx={{ color: BOOKNEST_COLORS.muted }}>Loading rentals...</Typography>
      ) : data.rentals?.length ? (
        <Stack spacing={2}>
          {data.rentals.map((rental) => {
            const canReturn = rental.status === "active" || rental.status === "overdue";

            return (
              <Paper key={rental._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
                <Stack spacing={1.4}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
                        {rental.book?.title || "Book"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                        {rental.book?.author || "Unknown author"}
                      </Typography>
                    </Box>
                    <Chip
                      label={rental.status}
                      sx={{
                        borderRadius: 999,
                        textTransform: "capitalize",
                        bgcolor: rental.status === "overdue" || rental.status === "flagged" ? "#fff4e5" : "#eef8ee",
                        color: rental.status === "overdue" || rental.status === "flagged" ? "#9a5c00" : "#2d6a33",
                      }}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ flexWrap: "wrap" }}>
                    <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                      Rental: {rental.rentalType} x {rental.rentalDuration}
                    </Typography>
                    <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                      Due: {formatDate(rental.dueDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                      Rental fee: {formatBookPrice(Number(rental.rentalFee || 0))}
                    </Typography>
                    <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                      Deposit paid: {formatBookPrice(Number(rental.depositAmount || 0))}
                    </Typography>
                    <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                      Overdue: {formatBookPrice(Number(rental.overdueCharge || 0))}
                    </Typography>
                  </Stack>

                  {Number(rental.depositRefundEligible || 0) > 0 ? (
                    <Alert severity={rental.depositReleaseStatus === "held" ? "info" : "success"}>
                      Refund eligible: {formatBookPrice(Number(rental.depositRefundEligible || 0))}. Status: {rental.depositReleaseStatus}.
                      {rental.depositReleaseStatus === "held"
                        ? " It will be released when you have no active rentals."
                        : ""}
                    </Alert>
                  ) : null}

                  {rental.damageCondition ? (
                    <Alert icon={<WarningAmberRoundedIcon fontSize="inherit" />} severity="info">
                      Condition: {rental.damageCondition}. Damage charge:{" "}
                      {formatBookPrice(Number(rental.damageCharge || 0))}. Deposit released:{" "}
                      {formatBookPrice(Number(rental.depositRefunded || 0))}
                    </Alert>
                  ) : null}

                  {canReturn ? (
                    <Button
                      variant="contained"
                      sx={{ alignSelf: "flex-start", borderRadius: 999, textTransform: "none" }}
                      onClick={() => {
                        setSelectedRental(rental);
                        setRating(5);
                        setReviewText("");
                      }}
                    >
                      Return Book
                    </Button>
                  ) : null}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Alert severity="info">No rentals found yet.</Alert>
      )}

      <Dialog
        open={Boolean(selectedRental)}
        onClose={() => setSelectedRental(null)}
        fullWidth
        maxWidth="xs"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.58)",
          },
        }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 390,
            mx: 1.5,
            borderRadius: 4,
            p: 0.5,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          Review Before Return
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack spacing={0.4} sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
                {selectedRental?.book?.title || "Book"}
              </Typography>
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                Share your experience first, then we will complete the return.
              </Typography>
            </Stack>

            <RatingInput value={rating} onChange={setRating} />

            <TextField
              label="Write a review"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              multiline
              minRows={4}
              placeholder="What did you like or dislike about this book?"
              fullWidth
            />

            <Button
              variant="contained"
              disabled={isSubmittingReturn}
              sx={{ borderRadius: 999, textTransform: "none" }}
              onClick={async () => {
                if (!selectedRental) {
                  return;
                }

                try {
                  setIsSubmittingReturn(true);
                  setError("");
                  setMessage("");
                  const result = await rentalsApi.returnBook(selectedRental._id, {
                    condition: "good",
                    rating,
                    reviewText,
                  });
                  setSelectedRental(null);
                  await loadRentals();
                  const releasedNow = Number(result?.returnSummary?.depositReleasedNow || 0);
                  const heldAmount = Number(result?.returnSummary?.depositHeld || 0);
                  setMessage(
                    releasedNow > 0
                      ? `Return completed and ${formatBookPrice(releasedNow)} was refunded to your wallet.`
                      : heldAmount > 0
                        ? `Return completed. ${formatBookPrice(heldAmount)} refund is being held until you have no active rentals.`
                        : "Return completed successfully.",
                  );
                } catch (requestError) {
                  setError(requestError.message || "Unable to return this book");
                } finally {
                  setIsSubmittingReturn(false);
                }
              }}
            >
              {isSubmittingReturn ? "Submitting..." : "Submit Review & Return"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
