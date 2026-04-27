import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { dashboardNavItems } from "../../data/dashboardNav";
import { useAuth } from "../../context/useAuth";
import { BOOKNEST_COLORS, getUserInitials } from "../../utils/profile";

function DashboardNavButton({ item, compact }) {
  const location = useLocation();
  const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
  const Icon = item.icon;

  return (
    <Tooltip title={compact ? item.label : ""} placement="right">
      <Button
        component={NavLink}
        to={item.to}
        startIcon={<Icon fontSize="small" />}
        sx={{
          justifyContent: compact ? "center" : "flex-start",
          minWidth: 0,
          width: "100%",
          px: compact ? 1 : 1.5,
          py: 1.15,
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 600,
          color: isActive ? "#fff" : BOOKNEST_COLORS.text,
          bgcolor: isActive ? BOOKNEST_COLORS.primaryBrown : "transparent",
          boxShadow: isActive ? "0 14px 30px rgba(124, 79, 30, 0.18)" : "none",
          "& .MuiButton-startIcon": {
            mr: compact ? 0 : 1,
            ml: 0,
          },
          "&:hover": {
            bgcolor: isActive ? BOOKNEST_COLORS.secondaryBrown : "rgba(124, 79, 30, 0.08)",
          },
        }}
      >
        {!compact ? item.label : null}
      </Button>
    </Tooltip>
  );
}

export default function DashboardSidebar({ compact = false, onNavigate }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const initials = getUserInitials(user?.name, user?.email);
  const visibleItems = dashboardNavItems.filter(
    (item) => !Array.isArray(item.roles) || item.roles.includes(user?.role || "user"),
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: BOOKNEST_COLORS.card,
        borderRight: `1px solid ${BOOKNEST_COLORS.border}`,
      }}
    >
      <Box
        sx={{
          px: compact ? 1.5 : 2.5,
          py: 2.25,
          display: "flex",
          alignItems: "center",
          justifyContent: compact ? "center" : "flex-start",
          gap: 1.25,
        }}
      >
        <Avatar
          sx={{
            bgcolor: BOOKNEST_COLORS.primaryBrown,
            color: "#fff",
            width: 42,
            height: 42,
          }}
        >
          <AutoStoriesRoundedIcon />
        </Avatar>
        {!compact ? (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: BOOKNEST_COLORS.text }}>
              BookNest
            </Typography>
            <Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted }}>
              Reader workspace
            </Typography>
          </Box>
        ) : null}
      </Box>

      <Divider />

      <Stack spacing={1} sx={{ px: compact ? 1 : 1.5, py: 2, flex: 1 }}>
        {visibleItems.map((item) => (
          <Box key={item.to} onClick={onNavigate}>
            <DashboardNavButton item={item} compact={compact} />
          </Box>
        ))}
      </Stack>

      <Divider />

      <Box
        sx={{
          px: compact ? 1 : 1.5,
          py: 2,
        }}
      >
        <Stack
          direction={compact ? "column" : "row"}
          spacing={compact ? 1 : 1.25}
          sx={{ alignItems: "center" }}
        >
          <Avatar
            src={user?.avatarUrl || ""}
            sx={{
              width: 40,
              height: 40,
              bgcolor: BOOKNEST_COLORS.gold,
              color: BOOKNEST_COLORS.text,
              fontWeight: 700,
            }}
          >
            {!user?.avatarUrl ? initials : null}
          </Avatar>

          {!compact ? (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontWeight: 600, color: BOOKNEST_COLORS.text }}>
                {user?.name || "BookNest Reader"}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: BOOKNEST_COLORS.muted }}>
                {user?.email || "Signed in"}
              </Typography>
            </Box>
          ) : null}

          <Tooltip title="Logout">
            <Button
              onClick={handleLogout}
              sx={{
                minWidth: 0,
                color: BOOKNEST_COLORS.muted,
                borderRadius: 2,
                px: compact ? 1 : 1.2,
                "&:hover": { bgcolor: "rgba(197, 83, 83, 0.08)", color: BOOKNEST_COLORS.danger },
              }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}
