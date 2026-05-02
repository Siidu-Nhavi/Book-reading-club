import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { Box, Container, IconButton, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { appFooterStyles } from "./shared.styles";

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
    <Box component="footer" sx={appFooterStyles.root}>
      <Container maxWidth="xl">
        <Box sx={appFooterStyles.grid}>
          <Box sx={appFooterStyles.introBlock}>
            <Typography sx={appFooterStyles.brandTitle}>BookNest</Typography>
            <Typography sx={appFooterStyles.description}>
              A calm and practical place to discover, rent, and manage your reading journey.
            </Typography>

            <Stack direction="row" spacing={1.1} sx={appFooterStyles.socialList}>
              {socialIcons.map((IconComponent, index) => (
                <IconButton key={`social-icon-${index + 1}`} sx={appFooterStyles.socialButton}>
                  <IconComponent fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={appFooterStyles.sectionTitle}>
              Navigation
            </Typography>
            <Stack spacing={0.9}>
              {navigationLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={appFooterStyles.footerLink}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={appFooterStyles.sectionTitle}>
              Legal
            </Typography>
            <Stack spacing={0.9}>
              {legalLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={appFooterStyles.footerLink}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={0.6} sx={appFooterStyles.bottomBar}>
          <Typography variant="body2">(c) 2025-26 BookNest</Typography>
          <Typography variant="body2">Made for readers, by readers</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
