import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Button,
  InputAdornment,
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

export default function AdminWalletPage() {
  usePageTitle("Admin Users & Wallets - BookNest");
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState("");

  const formatSettlementMessage = (settlement, creditedAmount, userName) => {
    const settledAmount = Number(settlement?.settledAmount || 0);
    const baseMessage = `Topped up ${userName} by ${formatBookPrice(creditedAmount)}`;

    if (settledAmount <= 0) {
      return baseMessage;
    }

    return `${baseMessage}; ${formatBookPrice(settledAmount)} auto-cleared from pending dues.`;
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await adminApi.getAllUsers({ search });
        if (active) {
          setUsers(response.users || []);
        }
      } catch (error) {
        if (active) {
          setMessage(error.message || "Unable to load users");
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [search]);

  if (user?.role !== "admin") {
    return <Alert severity="error">Admin access is required for wallet top-ups.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
        <Stack spacing={1.5}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
            Admin Users & Wallets
          </Typography>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name or email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
          {message ? <Alert severity="info">{message}</Alert> : null}
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {users.map((entry) => (
          <Paper key={entry._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
                {entry.name} • {entry.email}
              </Typography>
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                Balance: {formatBookPrice(Number(entry.walletBalance || 0))} • Pending dues:{" "}
                {formatBookPrice(Number(entry.pendingDuesTotal || 0))}
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <TextField
                  label="Amount"
                  type="number"
                  value={amounts[entry._id] || ""}
                  onChange={(event) =>
                    setAmounts((current) => ({ ...current, [entry._id]: event.target.value }))
                  }
                />
                <TextField
                  label="Note"
                  value={notes[entry._id] || ""}
                  onChange={(event) =>
                    setNotes((current) => ({ ...current, [entry._id]: event.target.value }))
                  }
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      const result = await adminApi.topUpWallet({
                        userId: entry._id,
                        amount: Number(amounts[entry._id] || 0),
                        note: notes[entry._id] || "",
                      });
                      setMessage(
                        formatSettlementMessage(
                          result.wallet?.settlement,
                          result.wallet?.creditedAmount || 0,
                          result.user.name,
                        ),
                      );
                      const response = await adminApi.getAllUsers({ search });
                      setUsers(response.users || []);
                    } catch (error) {
                      setMessage(error.message || "Unable to top up wallet");
                    }
                  }}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Top Up
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
