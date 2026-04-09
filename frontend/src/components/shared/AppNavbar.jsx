import { useEffect, useMemo, useState } from "react";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Drawer,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ProfileAvatarMenu from "../ProfileAvatarMenu";
import SearchBar from "../common/SearchBar";
import useDebounce from "../../hooks/useDebounce";
import {
	PUBLIC_BUTTON_GHOST_SX,
	PUBLIC_BUTTON_PRIMARY_SX,
	PUBLIC_UI,
} from "../../utils/publicUi";
import { primaryNavLinks } from "../../data/navLinks";

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
		const nextSearch = searchParams.get("search") || "";

		if (nextSearch === searchInput) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setSearchInput(nextSearch);
		}, 0);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [searchInput, searchParams]);

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
			navigate(`/books${nextParams.toString() ? `?${nextParams.toString()}` : ""}`);
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
			spacing={{ xs: 0.5, md: 0.75 }}
			{...stackProps}
			sx={{
				alignItems: { xs: "stretch", md: "center" },
				...(stackProps.sx || {}),
			}}
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
				position="fixed"
				elevation={0}
				sx={{
					bgcolor: PUBLIC_UI.surface,
					color: PUBLIC_UI.text,
					boxShadow: "none",
					borderBottom: `1px solid ${PUBLIC_UI.border}`,
					top: 0,
					left: 0,
					right: 0,
				}}
			>
				<Box
					sx={{
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						px: { xs: 2, md: "5%" },
						gap: 1.2,
					}}
				>
					<Stack
						direction="row"
						spacing={1.1}
						sx={{ minWidth: 170, alignItems: "center" }}
					>
						{isBookDetailRoute ? (
							<Button
								onClick={handleBackToBrowse}
								startIcon={<ArrowBackRoundedIcon />}
								sx={{
									textTransform: "none",
									fontWeight: 700,
									color: PUBLIC_UI.primary,
									display: { xs: "none", md: "inline-flex" },
									minWidth: "fit-content",
									px: 0.6,
								}}
							>
								Back to Browse
							</Button>
						) : null}
						<Avatar
							sx={{
								width: 36,
								height: 36,
								bgcolor: PUBLIC_UI.primary,
								color: "#fff",
							}}
						>
							<AutoStoriesRoundedIcon sx={{ fontSize: 20 }} />
						</Avatar>
						<Box
							component={RouterLink}
							to={isBooksRoute ? "/books" : "/"}
							sx={{ textDecoration: "none", color: "inherit" }}
						>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 900,
									fontFamily: '"Playfair Display", serif',
									letterSpacing: "-0.02em",
								}}
							>
								BookNest
							</Typography>
						</Box>
					</Stack>

					{isBooksRoute ? (
						<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: { xs: 0.5, md: 2 } }}>
							<SearchBar
								value={searchInput}
								onChange={setSearchInput}
								onSubmit={updateSearchNow}
								placeholder="Search by title, author, or ISBN..."
								size="small"
								sx={{
									maxWidth: 520,
									width: "100%",
									"& .MuiOutlinedInput-root": {
										borderRadius: 999,
										minHeight: 42,
									},
								}}
							/>
						</Box>
					) : (
						<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5, flexGrow: 1, justifyContent: "center" }}>
							{renderNavLinks()}
						</Box>
					)}

					<Stack
						direction="row"
						spacing={1}
						sx={{ ml: "auto", alignItems: "center" }}
					>
						{isAuthenticated ? (
							<ProfileAvatarMenu avatarSize={36} colorScheme="public" />
						) : (
							<>
								<Button
									component={RouterLink}
									to="/login"
									variant="outlined"
									sx={{
										...PUBLIC_BUTTON_GHOST_SX,
										borderRadius: 999,
										textTransform: "none",
										fontWeight: 700,
										px: { xs: 1.6, md: 2.2 },
										display: { xs: isBooksRoute ? "inline-flex" : "none", md: "inline-flex" },
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
										borderRadius: 999,
										textTransform: "none",
										fontWeight: 700,
										px: { xs: 1.8, md: 2.4 },
										bgcolor: PUBLIC_UI.accent,
										"&:hover": {
											bgcolor: "#f1883e",
										},
										display: { xs: "none", md: "inline-flex" },
									}}
								>
									Get Started
								</Button>
							</>
						)}
						{!isBooksRoute ? (
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
						) : null}
					</Stack>
				</Box>
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
					<Stack
						direction="row"
						sx={{ justifyContent: "space-between", alignItems: "center" }}
					>
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
