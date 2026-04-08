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
import { PUBLIC_UI } from "../utils/publicUi";

export default function ProfileAvatarMenu({
  avatarSize = 42,
  showIdentity = false,
  tooltipTitle = "Open account menu",
  triggerTextColor = BOOKNEST_COLORS.text,
  colorScheme = "booknest",
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = getUserInitials(user?.name, user?.email);
  const isOpen = Boolean(anchorEl);
  const palette =
    colorScheme === "public"
      ? {
          avatarBg: PUBLIC_UI.primary,
          avatarText: "#fff",
          menuBg: PUBLIC_UI.surface,
          headerBg: PUBLIC_UI.surfaceSoft,
          border: PUBLIC_UI.border,
          text: PUBLIC_UI.text,
          muted: PUBLIC_UI.muted,
          danger: PUBLIC_UI.danger,
          shadow: PUBLIC_UI.heroShadow,
        }
      : {
          avatarBg: BOOKNEST_COLORS.gold,
          avatarText: BOOKNEST_COLORS.text,
          menuBg: BOOKNEST_COLORS.card,
          headerBg: BOOKNEST_COLORS.soft,
          border: BOOKNEST_COLORS.border,
          text: BOOKNEST_COLORS.text,
          muted: BOOKNEST_COLORS.muted,
          danger: BOOKNEST_COLORS.danger,
          shadow: "0 24px 50px rgba(43, 33, 24, 0.14)",
        };

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
          <Typography variant="caption" sx={{ color: palette.muted }}>
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
              bgcolor: palette.avatarBg,
              color: palette.avatarText,
              fontWeight: 700,
              border: "2px solid #fff",
              boxShadow:
                colorScheme === "public"
                  ? "0 10px 24px rgba(108, 92, 231, 0.22)"
                  : "0 10px 24px rgba(124, 79, 30, 0.16)",
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
            backgroundColor: palette.menuBg,
            border: `1px solid ${palette.border}`,
            boxShadow: palette.shadow,
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.75, backgroundColor: palette.headerBg }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: palette.text }}>
            {user?.name || "BookNest Reader"}
          </Typography>
          <Typography variant="body2" sx={{ color: palette.muted }} noWrap>
            {user?.email || "No email found"}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={() => handleNavigate("/dashboard")}>
          <ListItemIcon>
            <DashboardRoundedIcon fontSize="small" sx={{ color: palette.text }} />
          </ListItemIcon>
          My Dashboard
        </MenuItem>

        <MenuItem onClick={() => handleNavigate("/dashboard/profile")}>
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" sx={{ color: palette.text }} />
          </ListItemIcon>
          Edit Profile
        </MenuItem>

        <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" sx={{ color: palette.text }} />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            color: palette.danger,
            "& .MuiListItemIcon-root": {
              color: palette.danger,
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
