import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { BOOKNEST_COLORS, getProfileCompletion, getUserInitials } from "../utils/profile";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = getUserInitials(user?.name, user?.email);
  const profileCompletion = useMemo(() => getProfileCompletion(user), [user]);
  const [dismissedBannerAt, setDismissedBannerAt] = useState(null);
  const showCompletionBanner =
    profileCompletion.percentage < 80 && dismissedBannerAt !== profileCompletion.percentage;
  const bannerActionButtonSx = {
    minHeight: 48,
    px: 2.5,
    bgcolor: "rgba(255, 248, 238, 0.98)",
    color: BOOKNEST_COLORS.primaryBrown,
    border: "1px solid rgba(124, 79, 30, 0.14)",
    textTransform: "none",
    borderRadius: 999,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    boxShadow: "0 10px 22px rgba(48, 28, 8, 0.12)",
    "& .MuiButton-startIcon": {
      mr: 1,
    },
    "& .MuiButton-startIcon svg": {
      fontSize: 18,
    },
    "&:hover": {
      bgcolor: "#F2E3CF",
      borderColor: "rgba(124, 79, 30, 0.2)",
      boxShadow: "0 14px 28px rgba(48, 28, 8, 0.18)",
    },
  };

  return (
    <Stack spacing={3}>
      {showCompletionBanner ? (
        <Alert
          severity="warning"
          sx={{
            borderRadius: 3,
            alignItems: "center",
            backgroundColor: "rgba(200, 154, 79, 0.15)",
            color: BOOKNEST_COLORS.text,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            "& .MuiAlert-icon": {
              color: BOOKNEST_COLORS.primaryBrown,
            },
            "& .MuiAlert-action": {
              pt: { xs: 1.5, sm: 0.75 },
              pl: { xs: 0, sm: 2 },
              width: { xs: "100%", sm: "auto" },
            },
          }}
          action={
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: "space-between", sm: "flex-start" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                size="small"
                onClick={() => navigate("/dashboard/profile")}
                sx={{
                  color: BOOKNEST_COLORS.primaryBrown,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
                endIcon={<ChevronRightRoundedIcon />}
              >
                Complete Your Profile
              </Button>
              <IconButton
                size="small"
                onClick={() => setDismissedBannerAt(profileCompletion.percentage)}
                sx={{ color: BOOKNEST_COLORS.muted }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          }
        >
          Your profile is {profileCompletion.percentage}% complete. Add the missing details to
          unlock a more polished dashboard experience.
        </Alert>
      ) : null}

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
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "center" }}
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
            spacing={1.25}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              variant="outlined"
              startIcon={<EditRoundedIcon />}
              onClick={() => navigate("/dashboard/profile")}
              sx={{
                ...bannerActionButtonSx,
                width: { xs: "100%", sm: "auto" },
                justifyContent: "center",
              }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<SettingsRoundedIcon />}
              onClick={() => navigate("/dashboard/settings")}
              sx={{
                ...bannerActionButtonSx,
                width: { xs: "100%", sm: "auto" },
                justifyContent: "center",
                bgcolor: "rgba(255, 248, 238, 0.92)",
                boxShadow: "0 8px 18px rgba(48, 28, 8, 0.08)",
                "&:hover": {
                  ...bannerActionButtonSx["&:hover"],
                  bgcolor: "#EEDBC0",
                },
              }}
            >
              Settings
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            backgroundColor: BOOKNEST_COLORS.card,
          }}
        >
          <Stack spacing={2.25}>
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              Profile completeness
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={84}
                  thickness={4}
                  sx={{ color: "rgba(200, 154, 79, 0.18)" }}
                />
                <CircularProgress
                  variant="determinate"
                  value={profileCompletion.percentage}
                  size={84}
                  thickness={4}
                  sx={{
                    color:
                      profileCompletion.percentage >= 80
                        ? BOOKNEST_COLORS.gold
                        : BOOKNEST_COLORS.primaryBrown,
                    position: "absolute",
                    left: 0,
                  }}
                />
                <Box
                  sx={{
                    inset: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
                    {profileCompletion.percentage}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
                  {profileCompletion.percentage}% Completed
                </Typography>
                <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                  Fill the remaining details to complete your BookNest reader profile.
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={1}>
              {profileCompletion.missingFields.length > 0 ? (
                profileCompletion.missingFields.map((field) => (
                  <Stack key={field.key} direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: BOOKNEST_COLORS.gold,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                      Missing: {field.label}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleRoundedIcon
                    fontSize="small"
                    sx={{ color: BOOKNEST_COLORS.primaryBrown }}
                  />
                  <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                    Your profile is complete and ready to go.
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            backgroundColor: BOOKNEST_COLORS.card,
          }}
        >
          <Stack spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: "rgba(200, 154, 79, 0.18)",
                color: BOOKNEST_COLORS.primaryBrown,
                width: 44,
                height: 44,
              }}
            >
              <AutoStoriesRoundedIcon />
            </Avatar>
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              Current plan
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
              Reader
            </Typography>
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              Your dashboard is ready for future rentals, wishlists, and activity.
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            backgroundColor: BOOKNEST_COLORS.card,
          }}
        >
          <Stack spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: "rgba(200, 154, 79, 0.18)",
                color: BOOKNEST_COLORS.primaryBrown,
                width: 44,
                height: 44,
              }}
            >
              <SettingsRoundedIcon />
            </Avatar>
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              Account email
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
              {user?.email}
            </Typography>
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
              This email is used for authentication and profile communication.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
