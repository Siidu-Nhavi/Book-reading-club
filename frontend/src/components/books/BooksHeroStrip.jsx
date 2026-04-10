import { Box, Container, Stack, Typography } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function BooksHeroStrip() {
  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: `1px solid ${PUBLIC_UI.borderStrong}`,
        background: `linear-gradient(135deg, ${PUBLIC_UI.pageTopDark} 0%, ${PUBLIC_UI.primary} 46%, ${PUBLIC_UI.accent} 100%)`,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 15% 18%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 52%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          spacing={0.8}
          sx={{
            py: { xs: 2.6, md: 3.1 },
            px: { xs: 0.5, md: 1 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.4rem", md: "1.7rem" },
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Browse Books
          </Typography>
          <Typography
            sx={{
              maxWidth: 760,
              color: "rgba(255,255,255,0.9)",
              fontWeight: 500,
              lineHeight: 1.45,
              fontSize: { xs: "0.92rem", md: "1rem" },
            }}
          >
            Filter by genre, rating, availability, and price to quickly find your next great read.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
