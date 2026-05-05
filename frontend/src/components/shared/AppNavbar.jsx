import { useEffect, useMemo, useState } from "react";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { AppBar, Avatar, Box, Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { primaryNavLinks } from "../../data/navLinks";
import useDebounce from "../../hooks/useDebounce";
import { PUBLIC_BUTTON_GHOST_SX, PUBLIC_BUTTON_PRIMARY_SX } from "../../utils/publicUi";
import SearchBar from "../common/SearchBar";
import ProfileAvatarMenu from "../ProfileAvatarMenu";
import { appNavbarStyles } from "./shared.styles";

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchInput, 300);

  const isBooksRoute = useMemo(
    () => location.pathname === "/books" || location.pathname.startsWith("/books/"),
    [location.pathname],
  );
  const isBookDetailRoute = useMemo(
    () => location.pathname.startsWith("/books/") && location.pathname !== "/books",
    [location.pathname],
  );

  useEffect(() => {
    if (!isBooksRoute) {
      return;
    }

    const currentSearch = (searchParams.get("search") || "").trim();
    const nextSearch = debouncedSearch.trim();

    if (currentSearch === nextSearch) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (nextSearch) {
      nextParams.set("search", nextSearch);
    } else {
      nextParams.delete("search");
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, isBooksRoute, searchParams, setSearchParams]);

  const updateSearchNow = () => {
    const nextParams = new URLSearchParams(searchParams);
    const nextSearch = searchInput.trim();

    if (nextSearch) {
      nextParams.set("search", nextSearch);
    } else {
      nextParams.delete("search");
    }

    nextParams.set("page", "1");

    if (isBookDetailRoute) {
      navigate(`/books?${nextParams.toString()}`);
      return;
    }

    setSearchParams(nextParams, { replace: false });
  };

  const handleBackToBrowse = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/books");
  };

  const activePath = useMemo(() => {
    if (location.pathname.startsWith("/books")) {
      return "/books";
    }

    return location.pathname;
  }, [location.pathname]);

  const renderNavLinks = (stackProps = {}) => (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 0.5, md: 1 }}
      {...stackProps}
      sx={appNavbarStyles.navLinksStack(stackProps.sx)}
    >
      {primaryNavLinks.map((item) => {
        const selected =
          item.to === "/"
            ? activePath === "/"
            : item.to === "/books"
              ? activePath === "/books"
              : activePath === item.to;

        return (
          <Button
            key={item.label}
            component={RouterLink}
            to={item.to}
            onClick={() => setIsDrawerOpen(false)}
            sx={appNavbarStyles.navLinkButton(selected)}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={appNavbarStyles.appBar}>
        <Box sx={appNavbarStyles.inner}>
          <Stack direction="row" spacing={1.3} sx={appNavbarStyles.brandStack}>
            {isBookDetailRoute ? (
              <Button
                onClick={handleBackToBrowse}
                startIcon={<ArrowBackRoundedIcon />}
                sx={appNavbarStyles.backButton}
              >
                Back to Browse
              </Button>
            ) : null}
            <Avatar sx={appNavbarStyles.logoAvatar}>
              <AutoStoriesRoundedIcon sx={appNavbarStyles.logoIcon} />
            </Avatar>
            <Box component={RouterLink} to={isBooksRoute ? "/books" : "/"} sx={appNavbarStyles.logoLink}>
              <Typography variant="subtitle1" sx={appNavbarStyles.logoTitle}>
                BookNest
              </Typography>
            </Box>
          </Stack>

          {isBooksRoute ? (
            <Box sx={appNavbarStyles.searchAndNavWrap}>
              <Button
                component={RouterLink}
                to="/"
                sx={appNavbarStyles.homeButton}
              >
                Home
              </Button>
              <Box sx={appNavbarStyles.searchWrap}>
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  onSubmit={updateSearchNow}
                  placeholder="Search by title, author, or ISBN..."
                  size="medium"
                  sx={appNavbarStyles.searchBar}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={appNavbarStyles.desktopNavWrap}>{renderNavLinks()}</Box>
          )}

          <Stack direction="row" spacing={1} sx={appNavbarStyles.actionsStack}>
            {isAuthenticated ? (
              <ProfileAvatarMenu avatarSize={44} colorScheme="public" />
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    ...PUBLIC_BUTTON_GHOST_SX,
                    ...appNavbarStyles.signInButton(isBooksRoute),
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  sx={{
                    ...PUBLIC_BUTTON_PRIMARY_SX,
                    ...appNavbarStyles.getStartedButton,
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setIsDrawerOpen(true)}
              sx={appNavbarStyles.menuButton}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Box>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: appNavbarStyles.drawerPaper }}
      >
        <Stack spacing={2.5} sx={appNavbarStyles.drawerStack}>
          <Stack direction="row" sx={appNavbarStyles.drawerHeader}>
            <Typography variant="h6" sx={appNavbarStyles.drawerTitle}>
              Menu
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          {isBooksRoute ? (
            <Button
              component={RouterLink}
              to="/"
              onClick={() => setIsDrawerOpen(false)}
              fullWidth
              sx={appNavbarStyles.drawerHomeButton}
            >
              Home
            </Button>
          ) : null}

          {renderNavLinks()}

          <Box sx={appNavbarStyles.drawerFooter}>
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
                    ...appNavbarStyles.drawerLoginButton,
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
                    ...appNavbarStyles.drawerSignupButton,
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
