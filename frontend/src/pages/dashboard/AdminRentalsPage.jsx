import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";

const adminApi = {
  getRentals: async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/admin/rentals?${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch rentals");
    return response.json();
  },
  forceReturn: async (id, damageLevel, damageCost) => {
    const response = await fetch(`/api/admin/rentals/${id}/force-return`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ damageLevel, damageCost }),
    });
    if (!response.ok) throw new Error("Failed to force return rental");
    return response.json();
  },
};

function ForceReturnDialog({ open, onClose, rental, onSubmit, loading }) {
  const [damageLevel, setDamageLevel] = useState("none");
  const [damageCost, setDamageCost] = useState("");

  const handleSubmit = () => {
    onSubmit(damageLevel, damageCost);
    setDamageLevel("none");
    setDamageCost("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          padding: "20px 24px",
        }}
      >
        ↩️ Force Return Rental
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2, display: "grid", gap: 2.5 }}>
        <Box sx={{ p: 2, bgcolor: "#f0f4f8", borderRadius: 1.5 }}>
          <Typography variant="body2" sx={{ color: "#1565c0", fontWeight: 600, mb: 1 }}>
            👤 User: {rental?.user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#1565c0", fontWeight: 600 }}>
            📚 Book: {rental?.book?.title}
          </Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel>Damage Level</InputLabel>
          <Select
            value={damageLevel}
            label="Damage Level"
            onChange={(e) => setDamageLevel(e.target.value)}
            sx={{
              fontSize: "14px",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="none">✓ No Damage</MenuItem>
            <MenuItem value="minor">⚠️ Minor Damage</MenuItem>
            <MenuItem value="moderate">⚠️⚠️ Moderate Damage</MenuItem>
            <MenuItem value="severe">🔴 Severe Damage</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="number"
          label="Damage Cost (₹)"
          value={damageCost}
          onChange={(e) => setDamageCost(e.target.value)}
          placeholder="0"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          bgcolor: "#f9f9f9",
          gap: 1,
        }}
      >
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            padding: "8px 24px",
          }}
        >
          {loading ? "Processing..." : "Force Return"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminRentalsPage() {
  usePageTitle("Admin Rentals - BookNest");
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [forceReturnDialog, setForceReturnDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    loadRentals();
  }, [page, search, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRentals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getRentals({
        page,
        limit: 10,
        search,
        status: status || undefined,
      });
      setRentals(data.rentals || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceReturn = async (damageLevel, damageCost) => {
    try {
      await adminApi.forceReturn(selectedRental._id, damageLevel, damageCost);
      setForceReturnDialog(false);
      loadRentals();
    } catch (err) {
      setError(err.message);
    }
  };

  const openForceReturnDialog = (rental) => {
    setSelectedRental(rental);
    setForceReturnDialog(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: "28px",
            color: "#1565c0",
            mb: 1,
          }}
        >
          📦 Rentals Management
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "14px" }}>
          Monitor active rentals, track returns, and manage damage assessments.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 1.5 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Toolbar - Search and Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: 2,
        }}
      >
        <TextField
          placeholder="🔍 Search by user email or book title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{
            flex: 1,
            minWidth: 250,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
          variant="outlined"
          size="small"
        />
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={status}
            label="Status Filter"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            sx={{
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="returned">Returned</MenuItem>
            <MenuItem value="">All Rentals</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Rentals Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1565c0" }}>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Book
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                End Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }} align="center">
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#999" }}>
                  <Typography>No rentals found. 📭</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((rental, index) => (
                <TableRow
                  key={rental._id}
                  sx={{
                    bgcolor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    "&:hover": { bgcolor: "#f0f0f0" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell sx={{ fontSize: "14px", fontWeight: 500 }}>
                    {rental.user?.name || "Unknown"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px", color: "#666" }}>
                    {rental.book?.title || "Unknown"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>
                    {formatDate(rental.startDate)}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>
                    {formatDate(rental.endDate)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "14px" }}>
                    {rental.status === "active" ? (
                      <Chip
                        label="Active"
                        variant="outlined"
                        size="small"
                        sx={{
                          bgcolor: "#ffebee",
                          borderColor: "#d32f2f",
                          color: "#d32f2f",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      />
                    ) : (
                      <Chip
                        label="Returned"
                        variant="outlined"
                        size="small"
                        sx={{
                          bgcolor: "#e8f5e9",
                          borderColor: "#2e7d32",
                          color: "#2e7d32",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {rental.status === "active" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<UndoIcon />}
                        onClick={() => openForceReturnDialog(rental)}
                        sx={{
                          textTransform: "none",
                          fontSize: "12px",
                          borderColor: "#d32f2f",
                          color: "#d32f2f",
                          "&:hover": { bgcolor: "#ffebee", borderColor: "#b71c1c" },
                        }}
                      >
                        Force Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          p: 2,
          bgcolor: "#fff",
          borderRadius: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
          Page {page} of {totalPages}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            sx={{ textTransform: "none" }}
          >
            ← Previous
          </Button>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            sx={{ textTransform: "none" }}
          >
            Next →
          </Button>
        </Stack>
      </Box>

      {/* Force Return Dialog */}
      <ForceReturnDialog
        open={forceReturnDialog}
        onClose={() => setForceReturnDialog(false)}
        rental={selectedRental}
        onSubmit={handleForceReturn}
        loading={loading}
      />
    </Box>
  );
}
