import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { Box, Container, IconButton, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PUBLIC_UI } from "../../utils/publicUi";

const socialIcons = [InstagramIcon, XIcon, LinkedInIcon];

const navigationLinks = [
  { label: "Books", to: "/books" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about-us" },
];

const legalLinks = [
  { label: "Privacy", to: "/privacy-policy" },
  { label: "Terms", to: "/terms-of-service" },
  { label: "Support", to: "/support" },
];

export default function AppFooter() {
	return (
		<Box
			component="footer"
			sx={{
				mt: 10,
				pt: { xs: 6, md: 8 },
				pb: { xs: 5, md: 5 },
				backgroundColor: "#000000",
				borderTop: "1px solid rgba(255, 255, 255, 0.16)",
				color: "rgba(255, 255, 255, 0.72)",
			}}
		>
			<Container maxWidth="xl">
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 1.3fr) 1fr 1fr" },
						gap: { xs: 3, md: 4 },
						alignItems: "start",
					}}
				>
					<Box sx={{ maxWidth: 360 }}>
						<Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff" }}>
							BookNest
						</Typography>
						<Typography sx={{ mt: 1, lineHeight: 1.7 }}>
							A calm and practical place to discover, rent, and manage your reading journey.
						</Typography>

						<Stack
							direction="row"
							spacing={1.1}
							sx={{ mt: 2.2, minHeight: 40, alignItems: "center" }}
						>
							{socialIcons.map((IconComponent, index) => (
								<IconButton
									key={`social-icon-${index + 1}`}
									sx={{
										width: 40,
										height: 40,
										color: "#ffffff",
										bgcolor: "rgba(255, 255, 255, 0.08)",
										border: "1px solid rgba(255, 255, 255, 0.18)",
										display: "inline-flex",
										alignItems: "center",
										justifyContent: "center",
										transition: "all 0.25s ease",
										"&:hover": {
											bgcolor: "rgba(255, 255, 255, 0.16)",
											transform: "translateY(-2px)",
										},
									}}
								>
									<IconComponent fontSize="small" />
								</IconButton>
							))}
						</Stack>
					</Box>

					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ffffff", mb: 1.2 }}>
							Navigation
						</Typography>
						<Stack spacing={0.9}>
							{navigationLinks.map((link) => (
								<MuiLink
									key={link.label}
									component={RouterLink}
									to={link.to}
									underline="none"
									sx={{
										fontWeight: 500,
										color: "rgba(255, 255, 255, 0.72)",
										width: "fit-content",
										"&:hover": { color: "#ffffff" },
									}}
								>
									{link.label}
								</MuiLink>
							))}
						</Stack>
					</Box>

					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ffffff", mb: 1.2 }}>
							Legal
						</Typography>
						<Stack spacing={0.9}>
							{legalLinks.map((link) => (
								<MuiLink
									key={link.label}
									component={RouterLink}
									to={link.to}
									underline="none"
									sx={{
										fontWeight: 500,
										color: "rgba(255, 255, 255, 0.72)",
										width: "fit-content",
										"&:hover": { color: "#ffffff" },
									}}
								>
									{link.label}
								</MuiLink>
							))}
						</Stack>
					</Box>
				</Box>

				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={0.6}
					sx={{
						mt: 5,
						pt: 3,
						borderTop: "1px solid rgba(255, 255, 255, 0.16)",
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", md: "center" },
					}}
				>
					<Typography variant="body2">© 2025-26 BookNest</Typography>
					<Typography variant="body2">Made for readers, by readers</Typography>
				</Stack>
			</Container>
		</Box>
	);
}
