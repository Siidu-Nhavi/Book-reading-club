import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProfileAvatarMenu from "../ProfileAvatarMenu";
import { BOOKNEST_COLORS } from "../../utils/profile";

export default function DashboardNavbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(245, 240, 232, 0.96)",
        color: BOOKNEST_COLORS.text,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${BOOKNEST_COLORS.border}`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 76,
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <IconButton
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard home"
            sx={{
              bgcolor: BOOKNEST_COLORS.primaryBrown,
              color: "#fff",
              "&:hover": {
                bgcolor: BOOKNEST_COLORS.secondaryBrown,
              },
            }}
          >
            <AutoStoriesRoundedIcon />
          </IconButton>

          <Button
            onClick={() => navigate("/dashboard")}
            color="inherit"
            sx={{
              px: 0.5,
              minWidth: 0,
              textTransform: "none",
              fontWeight: 800,
              fontSize: { xs: "1rem", sm: "1.15rem" },
              letterSpacing: "-0.02em",
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            BookNest
          </Button>
        </Box>

        <ProfileAvatarMenu
          avatarSize={44}
          tooltipTitle="Open dashboard menu"
          triggerTextColor={BOOKNEST_COLORS.text}
        />
      </Toolbar>
    </AppBar>
  );
}
