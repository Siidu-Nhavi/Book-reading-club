import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
	Alert,
	Avatar,
	Box,
	Button,
	CircularProgress,
	Chip,
	Divider,
	FormControl,
	FormControlLabel,
	MenuItem,
	Paper,
	Select,
	Snackbar,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { profileApi } from "../../api";
import usePageTitle from "../../hooks/usePageTitle";
import { BOOKNEST_COLORS } from "../../utils/profile";

const DEFAULT_SETTINGS = {
	emailOrderUpdates: true,
	emailRecommendations: true,
	pushFlashDeals: false,
	smsDeliveryAlerts: true,
	oneClickCheckout: false,
	saveCardsForFasterCheckout: true,
	defaultDeliveryType: "home",
	twoFactorAuth: false,
	allowNewDeviceLogin: true,
	marketingPersonalization: true,
};

export default function AccountSettings() {
	usePageTitle("Settings — BookNest");
	const [settings, setSettings] = useState(DEFAULT_SETTINGS);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");
	const [savedNoticeOpen, setSavedNoticeOpen] = useState(false);

	useEffect(() => {
		let active = true;

		const loadSettings = async () => {
			try {
				setIsLoading(true);
				setError("");
				const data = await profileApi.getAccountSettings();

				if (!active) {
					return;
				}

				setSettings({ ...DEFAULT_SETTINGS, ...data });
			} catch (fetchError) {
				if (active) {
					setError(fetchError.message || "Unable to load account settings");
				}
			} finally {
				if (active) {
					setIsLoading(false);
				}
			}
		};

		loadSettings();

		return () => {
			active = false;
		};
	}, []);

	const activeCount = useMemo(
		() => Object.values(settings).filter((value) => value === true).length,
		[settings],
	);

	const handleToggle = (key) => (_event, checked) => {
		setSettings((current) => ({ ...current, [key]: checked }));
	};

	const handleSelect = (event) => {
		const { value } = event.target;
		setSettings((current) => ({ ...current, defaultDeliveryType: value }));
	};

	const handleReset = () => {
		setSettings(DEFAULT_SETTINGS);
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			setError("");
			const data = await profileApi.updateAccountSettings(settings);
			setSettings({ ...DEFAULT_SETTINGS, ...(data?.settings || {}) });
			setSavedNoticeOpen(true);
		} catch (saveError) {
			setError(saveError.message || "Unable to save account settings");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Stack spacing={3}>
			<Snackbar
				open={savedNoticeOpen}
				autoHideDuration={2200}
				onClose={() => setSavedNoticeOpen(false)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					onClose={() => setSavedNoticeOpen(false)}
					severity="success"
					variant="filled"
					sx={{
						borderRadius: 2,
						bgcolor: BOOKNEST_COLORS.primaryBrown,
						color: "#fff",
					}}
				>
					Settings saved
				</Alert>
			</Snackbar>

			<Paper
				elevation={0}
				sx={{
					p: { xs: 3, md: 4 },
					borderRadius: 3,
					border: `1px solid ${BOOKNEST_COLORS.border}`,
					background: `linear-gradient(135deg, ${BOOKNEST_COLORS.card} 0%, ${BOOKNEST_COLORS.soft} 100%)`,
				}}
			>
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={2}
					sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
				>
					<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
						<Avatar
							sx={{
								bgcolor: "rgba(200, 154, 79, 0.18)",
								color: BOOKNEST_COLORS.primaryBrown,
								width: 52,
								height: 52,
							}}
						>
							<SettingsRoundedIcon />
						</Avatar>

						<Box>
							<Typography variant="overline" sx={{ color: BOOKNEST_COLORS.secondaryBrown, fontWeight: 700 }}>
								Dashboard
							</Typography>
							<Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
								Account Settings
							</Typography>
							<Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
								Ecommerce-style controls for orders, payments, security, and alerts.
							</Typography>
						</Box>
					</Stack>

					<Chip
						label={`${activeCount} active preferences`}
						sx={{
							fontWeight: 700,
							borderRadius: 2,
							backgroundColor: "rgba(124, 79, 30, 0.12)",
							color: BOOKNEST_COLORS.primaryBrown,
						}}
					/>
				</Stack>
			</Paper>

			{error ? <Alert severity="error">{error}</Alert> : null}

			{isLoading ? (
				<Paper
					elevation={0}
					sx={{
						p: 3,
						borderRadius: 3,
						border: `1px solid ${BOOKNEST_COLORS.border}`,
						backgroundColor: BOOKNEST_COLORS.card,
					}}
				>
					<Stack direction="row" spacing={1.2} sx={{ alignItems: "center", color: BOOKNEST_COLORS.muted }}>
						<CircularProgress size={18} />
						<Typography variant="body2">Loading your saved settings...</Typography>
					</Stack>
				</Paper>
			) : null}

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
					gap: 2.5,
					opacity: isLoading ? 0.55 : 1,
					pointerEvents: isLoading ? "none" : "auto",
				}}
			>
				<Paper
					elevation={0}
					sx={{
						p: { xs: 2.5, md: 3 },
						borderRadius: 3,
						border: `1px solid ${BOOKNEST_COLORS.border}`,
						backgroundColor: BOOKNEST_COLORS.card,
					}}
				>
					<Stack spacing={1.8}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<LocalShippingRoundedIcon sx={{ color: BOOKNEST_COLORS.primaryBrown }} />
							<Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
								Orders And Delivery
							</Typography>
						</Stack>
						<Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
							Choose how your book-rental order updates are delivered.
						</Typography>
						<Divider />
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.emailOrderUpdates}
									onChange={handleToggle("emailOrderUpdates")}
								/>
							}
							label="Email me order and return updates"
						/>
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.smsDeliveryAlerts}
									onChange={handleToggle("smsDeliveryAlerts")}
								/>
							}
							label="Send SMS alerts for delivery and pickup windows"
						/>
						<FormControl size="small" fullWidth disabled={isSaving}>
							<Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted, mb: 0.5 }}>
								Default delivery type
							</Typography>
							<Select value={settings.defaultDeliveryType} onChange={handleSelect}>
								<MenuItem value="home">Home delivery</MenuItem>
								<MenuItem value="pickup">Store pickup</MenuItem>
								<MenuItem value="smart-locker">Smart locker</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Paper>

				<Paper
					elevation={0}
					sx={{
						p: { xs: 2.5, md: 3 },
						borderRadius: 3,
						border: `1px solid ${BOOKNEST_COLORS.border}`,
						backgroundColor: BOOKNEST_COLORS.card,
					}}
				>
					<Stack spacing={1.8}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<CreditCardRoundedIcon sx={{ color: BOOKNEST_COLORS.primaryBrown }} />
							<Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
								Payments And Checkout
							</Typography>
						</Stack>
						<Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
							Streamline checkout behavior the way ecommerce dashboards do.
						</Typography>
						<Divider />
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.saveCardsForFasterCheckout}
									onChange={handleToggle("saveCardsForFasterCheckout")}
								/>
							}
							label="Save payment methods for faster checkout"
						/>
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.oneClickCheckout}
									onChange={handleToggle("oneClickCheckout")}
								/>
							}
							label="Enable one-click checkout for low-risk orders"
						/>
					</Stack>
				</Paper>

				<Paper
					elevation={0}
					sx={{
						p: { xs: 2.5, md: 3 },
						borderRadius: 3,
						border: `1px solid ${BOOKNEST_COLORS.border}`,
						backgroundColor: BOOKNEST_COLORS.card,
					}}
				>
					<Stack spacing={1.8}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<SecurityRoundedIcon sx={{ color: BOOKNEST_COLORS.primaryBrown }} />
							<Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
								Privacy And Security
							</Typography>
						</Stack>
						<Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
							Protect your account with security defaults used by modern shopping apps.
						</Typography>
						<Divider />
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.twoFactorAuth}
									onChange={handleToggle("twoFactorAuth")}
								/>
							}
							label="Require two-factor authentication on login"
						/>
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.allowNewDeviceLogin}
									onChange={handleToggle("allowNewDeviceLogin")}
								/>
							}
							label="Allow login from new devices after verification"
						/>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", color: BOOKNEST_COLORS.muted }}>
							<LockRoundedIcon sx={{ fontSize: 17 }} />
							<Typography variant="caption">Advanced password and session tools can be added in the next backend iteration.</Typography>
						</Stack>
					</Stack>
				</Paper>

				<Paper
					elevation={0}
					sx={{
						p: { xs: 2.5, md: 3 },
						borderRadius: 3,
						border: `1px solid ${BOOKNEST_COLORS.border}`,
						backgroundColor: BOOKNEST_COLORS.card,
					}}
				>
					<Stack spacing={1.8}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<NotificationsActiveRoundedIcon sx={{ color: BOOKNEST_COLORS.primaryBrown }} />
							<Typography variant="h6" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
								Marketing And Alerts
							</Typography>
						</Stack>
						<Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
							Tune recommendation quality and promotional notifications.
						</Typography>
						<Divider />
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.emailRecommendations}
									onChange={handleToggle("emailRecommendations")}
								/>
							}
							label="Send personalized reading recommendations"
						/>
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.pushFlashDeals}
									onChange={handleToggle("pushFlashDeals")}
								/>
							}
							label="Push flash deals and limited-time rental offers"
						/>
						<FormControlLabel
							control={
								<Switch
									disabled={isSaving}
									checked={settings.marketingPersonalization}
									onChange={handleToggle("marketingPersonalization")}
								/>
							}
							label="Allow personalization based on order behavior"
						/>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", color: BOOKNEST_COLORS.muted }}>
							<CampaignRoundedIcon sx={{ fontSize: 17 }} />
							<Typography variant="caption">Promotions stay optional and can be switched off at any time.</Typography>
						</Stack>
					</Stack>
				</Paper>
			</Box>

			<Paper
				elevation={0}
				sx={{
					p: { xs: 2.5, md: 3 },
					borderRadius: 3,
					border: `1px solid ${BOOKNEST_COLORS.border}`,
					backgroundColor: BOOKNEST_COLORS.card,
				}}
			>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}>
					<Button
						variant="outlined"
						startIcon={<RestartAltRoundedIcon />}
						onClick={handleReset}
						disabled={isSaving}
						sx={{
							textTransform: "none",
							borderRadius: 2,
							borderColor: BOOKNEST_COLORS.border,
							color: BOOKNEST_COLORS.primaryBrown,
						}}
					>
						Reset to Defaults
					</Button>
					<Button
						variant="contained"
						startIcon={<SaveRoundedIcon />}
						onClick={handleSave}
						disabled={isSaving || isLoading}
						sx={{
							textTransform: "none",
							borderRadius: 2,
							bgcolor: BOOKNEST_COLORS.primaryBrown,
							"&:hover": { bgcolor: BOOKNEST_COLORS.secondaryBrown },
						}}
					>
						{isSaving ? "Saving..." : "Save Preferences"}
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}