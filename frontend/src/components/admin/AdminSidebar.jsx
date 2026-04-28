import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard/admin/dashboard", icon: DashboardIcon },
  { label: "Books", path: "/dashboard/admin/books", icon: BookIcon },
  { label: "Users", path: "/dashboard/admin/users", icon: PeopleIcon },
  { label: "Rentals", path: "/dashboard/admin/rentals", icon: LibraryBooksIcon },
  { label: "Reviews", path: "/dashboard/admin/reviews", icon: ReviewsIcon },
];

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#1565c0",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: "2px solid rgba(255, 255, 255, 0.15)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.05)",
          },
        }}
        onClick={() => handleNavClick("/dashboard/admin/dashboard")}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            margin: 0,
            letterSpacing: "0.5px",
          }}
        >
          📚 BookNest
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "11px" }}>
          Admin Panel
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 1.5, py: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: "8px",
                  padding: "12px 16px",
                  bgcolor: isActive ? "rgba(255, 255, 255, 0.25)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255, 255, 255, 0.8)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                  borderLeft: isActive ? "4px solid #fff" : "4px solid transparent",
                  paddingLeft: isActive ? "12px" : "16px",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: "40px",
                    fontSize: "20px",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "14px",
                      letterSpacing: "0.3px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer Info */}
      <Box
        sx={{
          p: 2,
          borderTop: "2px solid rgba(255, 255, 255, 0.15)",
          bgcolor: "rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "11px" }}>
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );
}
