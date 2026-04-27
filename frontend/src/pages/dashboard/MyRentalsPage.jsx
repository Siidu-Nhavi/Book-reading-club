import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Chip,
  Paper,
  Stack,
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

export default function MyRentalsPage() {
  usePageTitle("My Rentals - BookNest");
  const [data, setData] = useState({ rentals: [], alerts: [], wallet: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}
      >
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
            My Rentals
          </Typography>
          <Typography sx={{ color: BOOKNEST_COLORS.muted }}>
            Track due dates, overdue charges, damage outcomes, and wallet impact from each rental.
          </Typography>
          <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.primaryBrown }}>
            Wallet balance: {formatBookPrice(Number(data.wallet?.balance || 0))}
          </Typography>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

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
          {data.rentals.map((rental) => (
            <Paper
              key={rental._id}
              elevation={0}
              sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}
            >
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
                    Deposit: {formatBookPrice(Number(rental.depositAmount || 0))}
                  </Typography>
                  <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                    Overdue: {formatBookPrice(Number(rental.overdueCharge || 0))}
                  </Typography>
                </Stack>

                {rental.damageCondition ? (
                  <Alert icon={<WarningAmberRoundedIcon fontSize="inherit" />} severity="info">
                    Condition: {rental.damageCondition}. Damage charge:{" "}
                    {formatBookPrice(Number(rental.damageCharge || 0))}. Deposit refunded:{" "}
                    {formatBookPrice(Number(rental.depositRefunded || 0))}
                  </Alert>
                ) : null}
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Alert severity="info">No rentals found yet.</Alert>
      )}
    </Stack>
  );
}
