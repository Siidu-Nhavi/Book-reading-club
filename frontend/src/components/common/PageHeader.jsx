import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function PageHeader({ eyebrow, title, subtitle, ctaLabel, ctaTo }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{
        alignItems: { xs: "flex-start", md: "flex-end" },
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ maxWidth: 680 }}>
        {eyebrow ? (
          <Typography
            variant="overline"
            sx={{
              color: PUBLIC_UI.primary,
              fontWeight: 600,
              letterSpacing: "0.14em",
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          variant="h3"
          sx={{
            color: PUBLIC_UI.text,
            fontFamily: '"DM Sans", "Segoe UI", sans-serif',
            fontWeight: 600,
            fontSize: { xs: "2rem", md: "2.8rem" },
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            variant="body1"
            sx={{
              mt: 1.2,
              color: PUBLIC_UI.muted,
              maxWidth: 620,
              lineHeight: 1.75,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {ctaLabel && ctaTo ? (
        <MuiLink
          component={Link}
          to={ctaTo}
          underline="none"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: PUBLIC_UI.primary,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {ctaLabel}
          <ChevronRightRoundedIcon fontSize="small" />
        </MuiLink>
      ) : null}
    </Stack>
  );
}
