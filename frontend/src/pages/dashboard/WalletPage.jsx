import {
  Alert,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { walletApi } from "../../api";
import usePageTitle from "../../hooks/usePageTitle";
import { formatBookPrice } from "../../utils/books";
import { BOOKNEST_COLORS } from "../../utils/profile";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function WalletPage() {
  usePageTitle("Wallet - BookNest");
  const [state, setState] = useState({
    balance: 0,
    pendingDuesTotal: 0,
    pendingDues: [],
    transactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [balance, transactions] = await Promise.all([
          walletApi.getBalance(),
          walletApi.getTransactions(),
        ]);

        if (active) {
          setState({
            balance: balance.balance || 0,
            pendingDuesTotal: balance.pendingDuesTotal || 0,
            pendingDues: balance.pendingDues || [],
            transactions: transactions.transactions || [],
          });
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load wallet");
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
            Wallet
          </Typography>
          <Typography sx={{ color: BOOKNEST_COLORS.muted }}>
            View your current balance, pending dues, and every wallet credit or debit.
          </Typography>
          <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.primaryBrown }}>
            Current balance: {formatBookPrice(Number(state.balance || 0))}
          </Typography>
          <Typography sx={{ fontWeight: 600, color: state.pendingDuesTotal > 0 ? BOOKNEST_COLORS.danger : BOOKNEST_COLORS.muted }}>
            Pending dues: {formatBookPrice(Number(state.pendingDuesTotal || 0))}
          </Typography>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {isLoading ? <Typography sx={{ color: BOOKNEST_COLORS.muted }}>Loading wallet...</Typography> : null}

      {state.pendingDues?.length ? (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>Pending dues</Typography>
            {state.pendingDues.map((due) => (
              <Typography key={due._id} variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                {formatBookPrice(Number(due.amount || 0))} • {due.reason} • {formatDate(due.createdAt)}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ) : null}

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}>
        <Stack spacing={1.4}>
          <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
            Transaction history
          </Typography>
          {state.transactions?.length ? (
            state.transactions.map((transaction) => (
              <Stack
                key={transaction._id}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ justifyContent: "space-between", py: 1, borderTop: `1px solid ${BOOKNEST_COLORS.border}` }}
              >
                <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.text }}>
                  {transaction.reason}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: transaction.type === "credit" ? "#2d6a33" : BOOKNEST_COLORS.danger, fontWeight: 700 }}
                >
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatBookPrice(Number(transaction.amount || 0))}
                </Typography>
                <Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted }}>
                  {formatDate(transaction.createdAt)}
                </Typography>
              </Stack>
            ))
          ) : (
            <Alert severity="info">No wallet transactions yet.</Alert>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
