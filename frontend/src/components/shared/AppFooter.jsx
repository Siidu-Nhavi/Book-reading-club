import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { Box, Container, IconButton, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PUBLIC_UI } from "../../utils/publicUi";
import { footerLinks } from "../../data/navLinks";

const socialIcons = [InstagramIcon, XIcon, LinkedInIcon];
const footerSectionsOrder = ["Product", "Company", "Support", "Legal"];

export default function AppFooter() {
	return (
		<Box
			component="footer"
			sx={{
				mt: 8,
				pt: { xs: 6, md: 8 },
				pb: { xs: 3.5, md: 4 },
				backgroundColor: "#1A1208",
				color: "rgba(255,255,255,0.74)",
			}}
		>
			<Container maxWidth="xl">
				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", md: "center" }}
					spacing={1}
					sx={{ mb: 3.2 }}
				>
					<Typography variant="h5" sx={{ fontWeight: 900, color: "#fff", fontFamily: '"Playfair Display", serif' }}>
						BookNest
					</Typography>
					<Typography sx={{ color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>
						Made for readers, by readers
					</Typography>
				</Stack>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "minmax(260px, 1.2fr) repeat(4, 1fr)" },
						gap: { xs: 3, md: 4 },
						alignItems: "start",
					}}
				>
					<Box sx={{ maxWidth: 360 }}>
						<Typography sx={{ mt: 1.2, lineHeight: 1.75 }}>
							Your gateway to endless stories and knowledge across public pages and reader workflows.
						</Typography>

						<Stack
							direction="row"
							spacing={1.1}
							alignItems="center"
							sx={{ mt: 2.2, minHeight: 40 }}
						>
							{socialIcons.map((IconComponent, index) => (
								<IconButton
									key={`social-icon-${index + 1}`}
									sx={{
										width: 40,
										height: 40,
										color: "#fff",
										bgcolor: "rgba(255,255,255,0.08)",
										display: "inline-flex",
										alignItems: "center",
										justifyContent: "center",
										transition: "all 0.25s ease",
										"&:hover": {
											bgcolor: PUBLIC_UI.primary,
											transform: "translateY(-2px)",
										},
										"&:active": {
											transform: "scale(0.96)",
										},
									}}
								>
									<IconComponent fontSize="small" />
								</IconButton>
							))}
						</Stack>
					</Box>

					{footerSectionsOrder.map((sectionTitle) => (
						<Box key={sectionTitle}>
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 800, color: "#fff", mb: 1.4 }}
							>
								{sectionTitle}
							</Typography>
							<Stack spacing={1.05}>
								{(footerLinks[sectionTitle] || []).map((link) => (
									<MuiLink
										key={link.label}
										component={RouterLink}
										to={link.to}
										underline="none"
										sx={{
											color: "rgba(255,255,255,0.74)",
											fontWeight: 600,
											width: "fit-content",
											transition: "color 0.25s ease, transform 0.2s ease",
											"&:hover": {
												color: "#fff",
												transform: "translateX(2px)",
											},
										}}
									>
										{link.label}
									</MuiLink>
								))}
							</Stack>
						</Box>
					))}
				</Box>

				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", md: "center" }}
					spacing={0.6}
					sx={{
						mt: 4,
						pt: 3,
						borderTop: "1px solid rgba(255,255,255,0.08)",
						color: "rgba(255,255,255,0.48)",
					}}
				>
					<Typography variant="body2">© 2025-26 BookNest</Typography>
					<Typography variant="body2">Made for readers, by readers</Typography>
				</Stack>
			</Container>
		</Box>
	);
}