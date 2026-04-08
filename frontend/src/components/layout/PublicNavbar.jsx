import { useEffect, useMemo, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  PUBLIC_BUTTON_GHOST_SX,
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_UI,
} from "../../utils/publicUi";
import ProfileAvatarMenu from "../ProfileAvatarMenu";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Books", to: "/books" },
  { label: "Categories", to: "/#categories" },
  { label: "How It Works", to: "/#how-it-works" },
];

export default function PublicNavbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isElevated, setIsElevated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsElevated(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activePath = useMemo(() => {
    if (location.pathname.startsWith("/books")) {
      return "/books";
    }

    return location.pathname;
  }, [location.pathname]);

  const renderNavLinks = (stackProps = {}) => (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 0.5, md: 0.75 }}
      alignItems={{ xs: "stretch", md: "center" }}
      {...stackProps}
    >
      {NAV_ITEMS.map((item) => {
        const selected =
          item.to === "/"
            ? activePath === "/"
            : item.to === "/books"
              ? activePath === "/books"
              : location.hash && item.to.endsWith(location.hash);

        return (
          <Button
            key={item.label}
            component={RouterLink}
            to={item.to}
            onClick={() => setIsDrawerOpen(false)}
            sx={{
              justifyContent: { xs: "flex-start", md: "center" },
              color: selected ? PUBLIC_UI.primary : PUBLIC_UI.muted,
              fontWeight: selected ? 800 : 700,
              textTransform: "none",
              borderRadius: 3,
              px: 1.25,
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          color: PUBLIC_UI.text,
          backdropFilter: "blur(14px)",
          boxShadow: "none",
          transition: "all 0.2s ease",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 94, py: 2 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                px: { xs: 2, md: 2.6 },
                py: 1.2,
                borderRadius: 5,
                border: `1px solid ${PUBLIC_UI.border}`,
                bgcolor: "rgba(255,255,255,0.96)",
                boxShadow: isElevated ? PUBLIC_UI.heroShadow : PUBLIC_UI.shadow,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ flexGrow: 1 }}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: PUBLIC_UI.primary,
                    color: "#fff",
                    boxShadow: "0 10px 24px rgba(108, 92, 231, 0.22)",
                  }}
                >
                  <AutoStoriesRoundedIcon />
                </Avatar>
                <Box component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    BookNest
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
                {renderNavLinks()}
              </Box>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}
              >
                {isAuthenticated ? (
                  <ProfileAvatarMenu avatarSize={42} colorScheme="public" />
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="text"
                      sx={{
                        ...PUBLIC_BUTTON_GHOST_SX,
                        border: "none",
                        boxShadow: "none",
                        bgcolor: PUBLIC_UI.primarySoft,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="contained"
                      sx={{
                        ...PUBLIC_BUTTON_PRIMARY_SX,
                        borderRadius: 3,
                        px: 2.2,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Stack>

              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setIsDrawerOpen(true)}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  color: PUBLIC_UI.primary,
                }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "min(88vw, 340px)",
            bgcolor: PUBLIC_UI.pageBackground,
            p: 2.5,
          },
        }}
      >
        <Stack spacing={2.5} sx={{ height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
              Menu
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          {renderNavLinks()}

          <Box sx={{ mt: "auto" }}>
            {isAuthenticated ? (
              <ProfileAvatarMenu avatarSize={46} colorScheme="public" />
            ) : (
              <Stack spacing={1.2}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...PUBLIC_BUTTON_GHOST_SX,
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  fullWidth
                  sx={{
                    ...PUBLIC_BUTTON_PRIMARY_SX,
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
