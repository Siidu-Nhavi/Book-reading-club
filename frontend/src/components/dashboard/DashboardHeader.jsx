import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { BOOKNEST_COLORS, getUserInitials } from "../../utils/profile";

const actionButtonSx = {
  minHeight: 56,
  minWidth: 164,
  px: 3,
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 700,
  border: "1px solid rgba(124, 79, 30, 0.16)",
  backgroundColor: "rgba(255, 248, 238, 0.98)",
  color: BOOKNEST_COLORS.primaryBrown,
  boxShadow: "0 10px 24px rgba(48, 28, 8, 0.12)",
  justifyContent: "center",
  transition: "all 0.3s ease-in-out",
  "& .MuiButton-startIcon": {
    mr: 1,
  },
  "& .MuiButton-startIcon svg": {
    fontSize: 18,
  },
  "&:hover": {
    backgroundColor: "#F2E3CF",
    borderColor: "rgba(124, 79, 30, 0.22)",
    boxShadow: "0 14px 28px rgba(48, 28, 8, 0.18)",
  },
};

export default function DashboardHeader({ user, onEditProfile, onSettings }) {
  const initials = getUserInitials(user?.name, user?.email);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background: `linear-gradient(135deg, ${BOOKNEST_COLORS.primaryBrown} 0%, ${BOOKNEST_COLORS.secondaryBrown} 100%)`,
        color: "#fff",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", lg: "center" }}
        justifyContent="space-between"
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ width: "100%" }}
        >
          <Avatar
            src={user?.avatarUrl || ""}
            sx={{
              width: 68,
              height: 68,
              bgcolor: BOOKNEST_COLORS.gold,
              color: BOOKNEST_COLORS.text,
              fontSize: 24,
            }}
          >
            {!user?.avatarUrl && initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)" }}>
              Welcome back
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.35rem" },
                lineHeight: 1.08,
                wordBreak: "break-word",
              }}
            >
              {user?.name || "BookNest Reader"}
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Manage your BookNest profile and dashboard settings from one place.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="stretch"
          sx={{
            width: { xs: "100%", lg: "auto" },
            "& > *": {
              width: { xs: "100%", sm: 176 },
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<EditRoundedIcon />}
            onClick={onEditProfile}
            sx={actionButtonSx}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsRoundedIcon />}
            onClick={onSettings}
            sx={{
              ...actionButtonSx,
              backgroundColor: "rgba(255, 248, 238, 0.94)",
            }}
          >
            Settings
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
