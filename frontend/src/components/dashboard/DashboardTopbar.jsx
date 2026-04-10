import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileAvatarMenu from "../ProfileAvatarMenu";
import { BOOKNEST_COLORS } from "../../utils/profile";

export default function DashboardTopbar({ userSummary, onOpenSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        bgcolor: "rgba(245, 240, 232, 0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${BOOKNEST_COLORS.border}`,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: { xs: 2, md: 3.5 },
          py: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: { xs: "inline-flex", lg: "none" },
              color: BOOKNEST_COLORS.text,
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted, fontWeight: 500 }}>
              {userSummary?.greeting || "Welcome back"}
            </Typography>
            <Typography
              sx={{
                color: BOOKNEST_COLORS.text,
                fontWeight: 700,
                fontSize: { xs: "1.05rem", md: "1.2rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isDashboardHome
                ? `${userSummary?.name || "Reader"}, here’s your BookNest workspace`
                : userSummary?.dateLabel || "Dashboard"}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
            minWidth: 0,
          }}
        >
          <TextField
            placeholder="Search dashboard sections"
            size="small"
            sx={{
              display: { xs: "none", md: "flex" },
              minWidth: { md: 240, xl: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 99,
                bgcolor: "#fff",
              },
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: BOOKNEST_COLORS.muted }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton
            sx={{
              bgcolor: "#fff",
              border: `1px solid ${BOOKNEST_COLORS.border}`,
              "&:hover": { bgcolor: BOOKNEST_COLORS.soft },
            }}
          >
            <NotificationsNoneRoundedIcon fontSize="small" sx={{ color: BOOKNEST_COLORS.text }} />
          </IconButton>

          <Button
            onClick={() => navigate("/books")}
            variant="contained"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: 999,
              textTransform: "none",
              px: 2.25,
              py: 1,
              fontWeight: 600,
              bgcolor: BOOKNEST_COLORS.primaryBrown,
              "&:hover": {
                bgcolor: BOOKNEST_COLORS.secondaryBrown,
              },
            }}
          >
            Browse Catalog
          </Button>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <ProfileAvatarMenu
              avatarSize={42}
              tooltipTitle="Open dashboard menu"
              triggerTextColor={BOOKNEST_COLORS.text}
            />
          </Box>

          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Avatar
              src={userSummary?.avatarUrl || ""}
              sx={{
                width: 40,
                height: 40,
                bgcolor: BOOKNEST_COLORS.gold,
                color: BOOKNEST_COLORS.text,
                fontWeight: 700,
              }}
            >
              {userSummary?.initials}
            </Avatar>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
