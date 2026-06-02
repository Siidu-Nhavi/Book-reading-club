import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { useAuth } from "../../context/useAuth";
import usePageTitle from "../../hooks/usePageTitle";
import { formatBookPrice } from "../../utils/books";
import { BOOKNEST_COLORS } from "../../utils/profile";

function calculatePreview(rental, condition, damagePercentage) {
  const replacementCost = Number(rental?.book?.replacementCost || 0);
  const depositAmount = Number(rental?.depositAmount || 0);

  let damageCharge = 0;

  if (condition === "minor") {
    damageCharge = replacementCost * damagePercentage;
  } else if (condition === "major") {
    damageCharge = replacementCost * 0.75;
  } else if (condition === "lost") {
    damageCharge = replacementCost;
  }

  const depositRefund = condition === "good" ? depositAmount : Math.max(0, depositAmount - damageCharge);

  return { damageCharge, depositRefund };
}

export default function AdminReturnsPage() {
  usePageTitle("Admin Rentals & Returns - BookNest");
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await adminApi.getAllRentalsAdmin({ status: "active", limit: 100 });
        if (active) {
          setRentals(response.rentals || []);
        }
      } catch (error) {
        if (active) {
          setStatusMessage(error.message || "Unable to load active rentals");
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  if (user?.role !== "admin") {
    return <Alert severity="error">Admin access is required for return processing.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
            Admin Rentals & Returns
          </Typography>
          <Typography sx={{ color: BOOKNEST_COLORS.muted }}>
            Process returns, calculate damage charges, and manage deposit refunds.
          </Typography>
          {statusMessage ? <Alert severity="info">{statusMessage}</Alert> : null}
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {rentals.map((rental) => {
          const currentForm = form[rental._id] || { condition: "good", damagePercentage: 0.25, adminNote: "" };
          const preview = calculatePreview(rental, currentForm.condition, Number(currentForm.damagePercentage || 0));

          return (
            <Paper key={rental._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
              <Stack spacing={1.5}>
                <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
                  {rental.book?.title} • {rental.user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                  Deposit: {formatBookPrice(Number(rental.depositAmount || 0))} • Replacement cost:{" "}
                  {formatBookPrice(Number(rental.book?.replacementCost || 0))}
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <TextField
                    select
                    label="Condition"
                    value={currentForm.condition}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [rental._id]: { ...currentForm, condition: event.target.value },
                      }))
                    }
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="minor">Minor</MenuItem>
                    <MenuItem value="major">Major</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                  </TextField>
                  {currentForm.condition === "minor" ? (
                    <TextField
                      label="Damage %"
                      type="number"
                      inputProps={{ min: 0.25, max: 0.5, step: 0.05 }}
                      value={currentForm.damagePercentage}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [rental._id]: { ...currentForm, damagePercentage: event.target.value },
                        }))
                      }
                    />
                  ) : null}
                  <TextField
                    label="Admin note"
                    value={currentForm.adminNote}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [rental._id]: { ...currentForm, adminNote: event.target.value },
                      }))
                    }
                    fullWidth
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                  Damage charge: {formatBookPrice(Number(preview.damageCharge || 0))} • Deposit refund:{" "}
                  {formatBookPrice(Number(preview.depositRefund || 0))}
                </Typography>
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      const result = await adminApi.processReturn(rental._id, {
                        condition: currentForm.condition,
                        damagePercentage: currentForm.condition === "minor" ? Number(currentForm.damagePercentage) : undefined,
                        adminNote: currentForm.adminNote,
                      });
                      setStatusMessage(result.message || "Return processed");
                      const response = await adminApi.getAllRentalsAdmin({ status: "active", limit: 100 });
                      setRentals(response.rentals || []);
                    } catch (error) {
                      setStatusMessage(error.message || "Unable to process return");
                    }
                  }}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Process Return
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}
