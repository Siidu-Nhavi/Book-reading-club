import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { useAuth } from "../../context/useAuth";
import usePageTitle from "../../hooks/usePageTitle";
import { BOOKNEST_COLORS, getProfileCompletion } from "../../utils/profile";

export default function DashboardHome() {
	usePageTitle("Dashboard - BookNest");

	const navigate = useNavigate();
	const { user } = useAuth();
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
					Your profile is {profileCompletion.percentage}% complete. Add the missing details to
					unlock a more polished dashboard experience.
				</Alert>
			) : null}

			<DashboardHeader
				user={user}
				onEditProfile={() => navigate("/dashboard/profile")}
				onSettings={() => navigate("/dashboard/settings")}
			/>

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
							sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
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
									<Typography
										variant="subtitle1"
										sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}
									>
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
