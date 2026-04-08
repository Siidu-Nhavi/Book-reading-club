import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { Box, Container, IconButton, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PUBLIC_UI } from "../../utils/publicUi";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Mobile App", to: "/mobile-app" },
      { label: "Audio Books", to: "/audio-books" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about-us" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help-center" },
      { label: "Community", to: "/community" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
    ],
  },
];

const socialIcons = [InstagramIcon, XIcon, LinkedInIcon];

export default function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: { xs: 5, md: 6 },
        backgroundColor: "#2B2670",
        color: "rgba(255,255,255,0.74)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(280px, 1.25fr) repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <Box sx={{ maxWidth: 360 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#fff" }}>
              BookNest
            </Typography>
            <Typography sx={{ mt: 1.2, lineHeight: 1.75 }}>
              Your gateway to endless stories and knowledge. Discover, rent, and return books with
              a cleaner product experience across every page.
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

          {footerColumns.map((column) => (
            <Box key={column.title}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#fff", mb: 1.4 }}
              >
                {column.title}
              </Typography>
              <Stack spacing={1.05}>
                {column.links.map((link) => (
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

        <Typography
          variant="body2"
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.48)",
          }}
        >
          Copyright {new Date().getFullYear()} BookNest. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
