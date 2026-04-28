import {
  Alert,
  Avatar,
  AvatarGroup,
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
  Tooltip,
  Badge,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WalletIcon from "@mui/icons-material/Wallet";
import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";

const adminApi = {
  getUsers: async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/admin/users?${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },
  suspendUser: async (id, isSuspended) => {
    const response = await fetch(`/api/admin/users/${id}/suspend`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSuspended }),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },
  assignRole: async (id, role) => {
    const response = await fetch(`/api/admin/users/${id}/role`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to assign role");
    return response.json();
  },
  topUpWallet: async (id, amount) => {
    const response = await fetch(`/api/admin/users/${id}/wallet`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error("Failed to top-up wallet");
    return response.json();
  },
};

function WalletDialog({ open, onClose, user, onTopUp, loading }) {
  const [amount, setAmount] = useState("");

  const handleTopUp = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    onTopUp(amount);
    setAmount("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "18px",
          fontWeight: 800,
          bgcolor: "linear-gradient(135deg, #1565c0 0%, #1040a2 100%)",
          color: "#fff",
          borderBottom: "none",
          padding: "24px",
        }}
      >
        💰 Top-up Wallet
      </DialogTitle>
      <Box sx={{ bgcolor: "#f5f5f5", px: 3, py: 1.5, fontSize: "13px", color: "#666", fontWeight: 600 }}>
        User: <span style={{ color: "#1565c0", fontWeight: 800 }}>{user?.name}</span>
      </Box>
      <DialogContent sx={{ pt: 3, pb: 2.5 }}>
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            bgcolor: "#e3f2fd",
            borderRadius: 2,
            border: "1px solid #b3e5fc",
          }}
        >
          <Typography variant="body2" sx={{ color: "#0d47a1", fontWeight: 700, fontSize: "13px", mb: 0.5 }}>
            Current Balance
          </Typography>
          <Typography sx={{ color: "#1565c0", fontWeight: 800, fontSize: "24px" }}>
            ₹{user?.walletBalance || 0}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, mb: 1, display: "block" }}>
          Amount to Add
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Enter amount in ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          variant="outlined"
          size="medium"
          inputProps={{ min: 0, step: 10 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "15px",
              borderRadius: "12px",
              fontWeight: 700,
              "& input": {
                textAlign: "right",
              },
              "&:hover": {
                boxShadow: "0 2px 8px rgba(21, 101, 192, 0.1)",
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "12px 16px",
            },
          }}
        />
        {amount && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "#f5f5f5",
              borderRadius: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "13px", color: "#666", fontWeight: 600 }}>
              New Balance
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#2e7d32", fontWeight: 800 }}>
              ₹{(parseInt(user?.walletBalance || 0) + parseInt(amount || 0)).toLocaleString("en-IN")}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          bgcolor: "#f9f9f9",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#666",
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleTopUp}
          variant="contained"
          disabled={loading || !amount || amount <= 0}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            padding: "10px 28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #1565c0 0%, #1040a2 100%)",
            transition: "all 0.3s ease",
            "&:hover:not(:disabled)": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(21, 101, 192, 0.3)",
            },
          }}
        >
          {loading ? "Processing..." : `Top-up ₹${amount || 0}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminUsersPage() {
  usePageTitle("Admin Users - BookNest");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, search, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getUsers({
        page,
        limit: 10,
        search,
        status,
      });
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (user) => {
    try {
      await adminApi.suspendUser(user._id, !user.isSuspended);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignRole = async (userId, newRole) => {
    try {
      await adminApi.assignRole(userId, newRole);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTopUpWallet = async (amount) => {
    try {
      await adminApi.topUpWallet(selectedUser._id, parseFloat(amount));
      setWalletDialogOpen(false);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const openWalletDialog = (user) => {
    setSelectedUser(user);
    setWalletDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* Main Container */}
      <Box sx={{ maxWidth: "1150px", margin: "0 auto", padding: "24px 20px" }}>
        {/* Page Header with Statistics */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 3, mb: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: "28px",
                color: "#1565c0",
                mb: 1,
              }}
            >
              👥 Users Management
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "14px" }}>
              Manage user accounts, roles, permissions, and wallet balances.
            </Typography>
          </Box>
          {/* Quick Stats */}
          <Stack direction="row" spacing={2}>
            <Box sx={{ p: 1.5, bgcolor: "#e8f5e9", borderRadius: 1.5, minWidth: 140 }}>
              <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", fontWeight: 600 }}>
                TOTAL USERS
              </Typography>
              <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "#2e7d32", mt: 0.5 }}>
                {totalPages > 0 ? users.length + ((page - 1) * 10) : 0}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: "#ffebee", borderRadius: 1.5, minWidth: 140 }}>
              <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", fontWeight: 600 }}>
                ACTIVE NOW
              </Typography>
              <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "#d32f2f", mt: 0.5 }}>
                {users.filter(u => !u.isSuspended).length}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Toolbar - Search and Filters */}
        <Paper
          sx={{
            p: 2.5,
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            borderRadius: 2,
            bgcolor: "#fff",
          }}
        >
          <TextField
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              width: "250px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "14px",
                bgcolor: "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(21, 101, 192, 0.1)",
                },
                "&:focus-within": {
                  boxShadow: "0 2px 12px rgba(21, 101, 192, 0.15)",
                },
              },
            }}
            variant="outlined"
            size="small"
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={status}
              label="Filter by Status"
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              sx={{
                borderRadius: "10px",
                fontSize: "14px",
                bgcolor: "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(21, 101, 192, 0.1)",
                },
              }}
            >
              <MenuItem value="">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  📋 <span>All Users</span>
                </Box>
              </MenuItem>
              <MenuItem value="active">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  ✅ <span>Active Only</span>
                </Box>
              </MenuItem>
              <MenuItem value="suspended">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  🚫 <span>Suspended Only</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Users Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1565c0" }}>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px", padding: "16px 12px" }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px", padding: "16px 12px" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px", padding: "16px 12px" }} align="center">
                Role
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#fff", fontSize: "14px", padding: "16px 12px" }}
                align="right"
              >
                Balance
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px", padding: "16px 12px" }} align="center">
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#fff", fontSize: "14px", padding: "16px 12px" }}
                align="center"
              >
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: "48px", mb: 1 }}>📭</Typography>
                    <Typography sx={{ color: "#999", fontWeight: 600 }}>
                      No users found in the system
                    </Typography>
                    <Typography sx={{ color: "#bbb", fontSize: "12px", mt: 1 }}>
                      Users will appear here once they create their accounts
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={user._id}
                  sx={{
                    bgcolor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    "&:hover": {
                      bgcolor: "#f0f0f0",
                      boxShadow: "inset 0 0 10px rgba(21, 101, 192, 0.05)",
                    },
                    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <TableCell sx={{ fontSize: "14px", fontWeight: 600, padding: "12px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: user.role === "admin" ? "#1565c0" : "#2e7d32",
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                          {user.name}
                        </Typography>
                        {user.role === "admin" && (
                          <Chip
                            label="Admin"
                            size="small"
                            icon={<AdminPanelSettingsIcon />}
                            sx={{
                              height: "18px",
                              fontSize: "10px",
                              fontWeight: 700,
                              bgcolor: "#e3f2fd",
                              color: "#1565c0",
                              marginTop: "2px",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", color: "#666", padding: "12px" }}>
                    <Tooltip title={user.email}>
                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                      >
                        {user.email}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "14px", padding: "12px" }}>
                    <FormControl sx={{ minWidth: 110 }} size="small">
                      <Select
                        value={user.role}
                        onChange={(e) => handleAssignRole(user._id, e.target.value)}
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: user.role === "admin" ? "#1565c0" : "#ccc",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: user.role === "admin" ? "#0d47a1" : "#999",
                          },
                        }}
                      >
                        <MenuItem value="user">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            👤 <span>User</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="admin">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            👨‍💼 <span>Admin</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "14px", fontWeight: 700, padding: "12px" }}>
                    <Tooltip
                      title={
                        user.walletBalance > 500
                          ? "Healthy balance"
                          : user.walletBalance > 100
                          ? "Good balance"
                          : "Low balance"
                      }
                    >
                      <Box
                        sx={{
                          display: "inline-block",
                          bgcolor:
                            user.walletBalance > 500
                              ? "#e8f5e9"
                              : user.walletBalance > 100
                              ? "#fff3e0"
                              : "#ffebee",
                          color:
                            user.walletBalance > 500
                              ? "#2e7d32"
                              : user.walletBalance > 100
                              ? "#e65100"
                              : "#d32f2f",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: 700,
                          border:
                            user.walletBalance > 500
                              ? "1px solid #a5d6a7"
                              : user.walletBalance > 100
                              ? "1px solid #ffe0b2"
                              : "1px solid #ef9a9a",
                        }}
                      >
                        ₹{user.walletBalance || 0}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "14px", padding: "12px" }}>
                    {user.isSuspended ? (
                      <Chip
                        icon={<BlockIcon />}
                        label="Suspended"
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
                        icon={<CheckCircleIcon />}
                        label="Active"
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
                  <TableCell align="center" sx={{ padding: "12px" }}>
                    <Stack direction="row" spacing={0.75} justifyContent="center">
                      <Tooltip title={user.isSuspended ? "Restore user access" : "Suspend user account"}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={user.isSuspended ? <CheckCircleIcon /> : <BlockIcon />}
                          color={user.isSuspended ? "success" : "error"}
                          onClick={() => handleSuspendUser(user)}
                          sx={{
                            textTransform: "none",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "6px 12px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {user.isSuspended ? "Restore" : "Suspend"}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Add funds to wallet">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<WalletIcon />}
                          onClick={() => openWalletDialog(user)}
                          sx={{
                            textTransform: "none",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "6px 12px",
                            borderColor: "#1565c0",
                            color: "#1565c0",
                            "&:hover": { bgcolor: "#e3f2fd", borderColor: "#0d47a1" },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Top-up
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

        {/* Pagination */}
        <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          p: 2.5,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#666", fontWeight: 700, fontSize: "13px", letterSpacing: "0.3px" }}
        >
          📄 Page <span style={{ color: "#1565c0", fontSize: "15px", fontWeight: 800 }}>{page}</span> of{" "}
          <span style={{ color: "#1565c0", fontSize: "15px", fontWeight: 800 }}>{totalPages}</span>
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Previous page">
            <span>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                ← Previous
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Next page">
            <span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                Next →
              </Button>
            </span>
          </Tooltip>
          </Stack>
        </Paper>

        {/* Wallet Dialog */}
        <WalletDialog
          open={walletDialogOpen}
          onClose={() => setWalletDialogOpen(false)}
          user={selectedUser}
          onTopUp={handleTopUpWallet}
          loading={loading}
        />
      </Box>
    </Box>
  );
}
