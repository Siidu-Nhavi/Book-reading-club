import { useState } from "react";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { BOOKNEST_COLORS, getUserInitials } from "../utils/profile";

export default function ProfileAvatarMenu({
  avatarSize = 42,
  showIdentity = false,
  tooltipTitle = "Open account menu",
  triggerTextColor = BOOKNEST_COLORS.text,
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = getUserInitials(user?.name, user?.email);
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = async () => {
    handleClose();
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      {showIdentity ? (
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: triggerTextColor }}>
            {user?.name || "BookNest Reader"}
          </Typography>
          <Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted }}>
            {user?.email}
          </Typography>
        </Box>
      ) : null}

      <Tooltip title={tooltipTitle}>
        <IconButton onClick={handleOpen} size="small" sx={{ p: 0.25 }}>
          <Avatar
            src={user?.avatarUrl || ""}
            alt={user?.name || "BookNest user"}
            sx={{
              width: avatarSize,
              height: avatarSize,
              bgcolor: BOOKNEST_COLORS.gold,
              color: BOOKNEST_COLORS.text,
              fontWeight: 700,
              border: "2px solid #fff",
              boxShadow: "0 10px 24px rgba(124, 79, 30, 0.16)",
            }}
          >
            {!user?.avatarUrl && initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        PaperProps={{
          sx: {
            mt: 1.25,
            minWidth: 255,
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            boxShadow: "0 24px 50px rgba(43, 33, 24, 0.14)",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.75, backgroundColor: BOOKNEST_COLORS.soft }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
            {user?.name || "BookNest Reader"}
          </Typography>
          <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }} noWrap>
            {user?.email || "No email found"}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={() => handleNavigate("/dashboard")}>
          <ListItemIcon>
            <DashboardRoundedIcon fontSize="small" sx={{ color: BOOKNEST_COLORS.text }} />
          </ListItemIcon>
          My Dashboard
        </MenuItem>

        <MenuItem onClick={() => handleNavigate("/dashboard/profile")}>
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" sx={{ color: BOOKNEST_COLORS.text }} />
          </ListItemIcon>
          Edit Profile
        </MenuItem>

        <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" sx={{ color: BOOKNEST_COLORS.text }} />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            color: BOOKNEST_COLORS.danger,
            "& .MuiListItemIcon-root": {
              color: BOOKNEST_COLORS.danger,
            },
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </MenuItem>
      </Menu>
    </Box>
  );
}
