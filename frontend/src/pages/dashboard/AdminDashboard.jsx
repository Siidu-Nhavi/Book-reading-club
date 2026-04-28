import { Box, Card, CardContent, CircularProgress, Grid, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";

// Create a simple admin API module
const adminApi = {
  getDashboardStats: async () => {
    const response = await fetch("/api/admin/dashboard", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    return response.json();
  },
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card
    sx={{
      height: "100%",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        transform: "translateY(-4px)",
      },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              fontWeight: 600,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1,
              display: "block",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color,
              fontSize: "32px",
              mt: 1,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            fontSize: "48px",
            opacity: 0.15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 60,
            width: 60,
          }}
        >
          <Icon />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  usePageTitle("Admin Dashboard - BookNest");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getDashboardStats();
        setStats(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  const cardData = [
    {
      title: "Total Books",
      value: stats?.totalBooks || 0,
      icon: () => "📚",
      color: "#1565c0",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: () => "👥",
      color: "#388e3c",
    },
    {
      title: "Active Rentals",
      value: stats?.activeRentals || 0,
      icon: () => "📦",
      color: "#d32f2f",
    },
    {
      title: "Total Reviews",
      value: stats?.totalReviews || 0,
      icon: () => "⭐",
      color: "#f57c00",
    },
    {
      title: "Suspended Users",
      value: stats?.suspendedUsers || 0,
      icon: () => "🚫",
      color: "#7b1fa2",
    },
  ];

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
          📊 Admin Dashboard
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "14px" }}>
          Overview of your BookNest system statistics and key metrics.
        </Typography>
      </Box>

      {/* Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* System Overview Section */}
      <Card
        sx={{
          mt: 3,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          borderTop: "4px solid #1565c0",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#1565c0",
              mb: 3,
              fontSize: "18px",
            }}
          >
            📈 System Overview
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#666",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                📚 Books in Library
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1565c0",
                  mt: 1,
                  fontSize: "24px",
                }}
              >
                {stats?.totalBooks || 0}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#666",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                📦 Active Rentals
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#d32f2f",
                  mt: 1,
                  fontSize: "24px",
                }}
              >
                {stats?.activeRentals || 0}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#666",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                👥 Registered Users
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#388e3c",
                  mt: 1,
                  fontSize: "24px",
                }}
              >
                {stats?.totalUsers || 0}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#666",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ⭐ Community Reviews
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#f57c00",
                  mt: 1,
                  fontSize: "24px",
                }}
              >
                {stats?.totalReviews || 0}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
