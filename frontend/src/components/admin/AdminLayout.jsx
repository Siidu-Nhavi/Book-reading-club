import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_WIDTH = 250;

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Fixed Sidebar - Desktop Only */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          display: { xs: "none", sm: "flex" },
          zIndex: 1200,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        anchor="left"
        onClose={handleDrawerToggle}
        open={mobileOpen}
        sx={{ display: { xs: "block", sm: "none" } }}
        PaperProps={{
          sx: { width: SIDEBAR_WIDTH, zIndex: 1100 },
        }}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: { xs: 0, sm: `${SIDEBAR_WIDTH}px` },
        }}
      >
        {/* Fixed Navbar */}
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "#fff",
            color: "#333",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            top: 0,
            zIndex: 1100,
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              padding: "12px 24px",
              minHeight: "64px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  display: { sm: "none" },
                  color: "#333",
                }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#1976d2",
                }}
              >
                📚 BookNest Admin
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                startIcon={<AccountCircleIcon />}
                onClick={handleProfileClick}
                sx={{
                  textTransform: "none",
                  color: "#333",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                {user?.name || "Admin"}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
              >
                <MenuItem onClick={handleProfileClose} disabled sx={{ color: "#999" }}>
                  {user?.email}
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#d32f2f",
                    "&:hover": { bgcolor: "#fff3cd" },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Scrollable Content Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: { xs: "16px", sm: "24px", md: "32px" },
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
