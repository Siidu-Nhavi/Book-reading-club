import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardActivityList from "../../components/dashboard/DashboardActivityList";
import DashboardBookRow from "../../components/dashboard/DashboardBookRow";
import DashboardSectionCard from "../../components/dashboard/DashboardSectionCard";
import DashboardStatsGrid from "../../components/dashboard/DashboardStatsGrid";
import { useAuth } from "../../context/useAuth";
import useDashboardOverview from "../../hooks/useDashboardOverview";
import usePageTitle from "../../hooks/usePageTitle";
import { BOOKNEST_COLORS, getProfileCompletion } from "../../utils/profile";

export default function DashboardHome() {
  usePageTitle("Dashboard - BookNest");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { userSummary, stats, rentals, listedBooks, wishlist, activity, loading, error } =
    useDashboardOverview(user);
  const profileCompletion = useMemo(() => getProfileCompletion(user), [user]);
  const [dismissedBannerAt, setDismissedBannerAt] = useState(null);
  const showCompletionBanner =
    profileCompletion.percentage < 80 && dismissedBannerAt !== profileCompletion.percentage;

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
              sx={{
                width: { xs: "100%", sm: "auto" },
                alignItems: "center",
                justifyContent: { xs: "space-between", sm: "flex-start" },
              }}
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
          Your profile is {profileCompletion.percentage}% complete. Add the missing details to unlock
          a more polished dashboard experience.
        </Alert>
      ) : null}

      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: 4,
          border: `1px solid ${BOOKNEST_COLORS.border}`,
          background:
            "linear-gradient(135deg, rgba(124,79,30,0.95) 0%, rgba(139,94,46,0.92) 58%, rgba(200,154,79,0.82) 100%)",
          color: "#fff",
        }}
      >
        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2.5}
          sx={{ justifyContent: "space-between", alignItems: { xl: "center" } }}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Typography variant="overline" sx={{ letterSpacing: "0.18em", opacity: 0.9 }}>
              Reader Dashboard
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" }, lineHeight: 1.05 }}>
              Everything you need to manage your BookNest activity in one place
            </Typography>
            <Typography sx={{ mt: 1.35, maxWidth: 560, opacity: 0.9 }}>
              Track profile progress, discover catalog-ready books, keep an eye on wishlist picks,
              and move quickly between the parts of your reader workspace that matter most.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            sx={{ minWidth: { xl: 300 } }}
          >
            <Button
              onClick={() => navigate("/dashboard/profile")}
              variant="contained"
              sx={{
                minHeight: 48,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#fff",
                color: BOOKNEST_COLORS.primaryBrown,
                px: 2.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
              }}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => navigate("/books")}
              variant="outlined"
              sx={{
                minHeight: 48,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.45)",
                px: 2.5,
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Browse Catalog
            </Button>
          </Stack>
        </Stack>
      </Box>

      {loading ? (
        <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
          Loading dashboard overview...
        </Typography>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      <DashboardStatsGrid stats={stats} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.4fr 1fr" },
          gap: 2.5,
        }}
      >
        <Stack spacing={2.5}>
          <DashboardSectionCard
            title="Current Rentals"
            description="Books you can return to quickly without leaving the dashboard."
            actionLabel="Browse books"
            onAction={() => navigate("/books")}
          >
            <Stack spacing={1.5}>
              {rentals.map((book) => (
                <DashboardBookRow key={book.id} book={book} />
              ))}
            </Stack>
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Listed Books"
            description="Catalog-ready titles surfaced through the stable dashboard adapter layer."
            actionLabel="Open settings"
            onAction={() => navigate("/dashboard/settings")}
          >
            <Stack spacing={1.5}>
              {listedBooks.map((book) => (
                <DashboardBookRow key={book.id} book={book} />
              ))}
            </Stack>
          </DashboardSectionCard>
        </Stack>

        <Stack spacing={2.5}>
          <DashboardSectionCard
            title="Profile Progress"
            description={`${userSummary?.name || "Your"} profile is ${profileCompletion.percentage}% complete.`}
            actionLabel="Finish profile"
            onAction={() => navigate("/dashboard/profile")}
          >
            <Stack spacing={1}>
              {profileCompletion.missingFields.length > 0 ? (
                profileCompletion.missingFields.map((field) => (
                  <Stack key={field.key} direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Wishlist Picks"
            description="Saved books and recommendation-ready catalog entries."
            actionLabel="Open catalog"
            onAction={() => navigate("/books")}
          >
            <Stack spacing={1.5}>
              {wishlist.map((book) => (
                <DashboardBookRow key={book.id} book={book} />
              ))}
            </Stack>
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Recent Activity"
            description="A stable, frontend-owned summary that can survive backend response changes."
          >
            <DashboardActivityList items={activity} />
          </DashboardSectionCard>
        </Stack>
      </Box>
    </Stack>
  );
}
