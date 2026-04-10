import { Box, Paper, Stack, Typography } from "@mui/material";
import { BOOKNEST_COLORS } from "../../utils/profile";

const TONES = {
  primary: {
    bg: "linear-gradient(135deg, rgba(124,79,30,0.12), rgba(200,154,79,0.14))",
    dot: BOOKNEST_COLORS.primaryBrown,
  },
  accent: {
    bg: "linear-gradient(135deg, rgba(200,154,79,0.12), rgba(139,94,46,0.12))",
    dot: BOOKNEST_COLORS.gold,
  },
  muted: {
    bg: "linear-gradient(135deg, rgba(119,101,81,0.1), rgba(124,79,30,0.08))",
    dot: BOOKNEST_COLORS.muted,
  },
};

export default function DashboardStatsGrid({ stats = [] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {stats.map((stat) => {
        const tone = TONES[stat.tone] || TONES.primary;

        return (
          <Paper
            key={stat.id}
            elevation={0}
            sx={{
              p: 2.25,
              borderRadius: 3,
              border: `1px solid ${BOOKNEST_COLORS.border}`,
              background: tone.bg,
            }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted, fontWeight: 600 }}>
                  {stat.label}
                </Typography>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: tone.dot,
                  }}
                />
              </Stack>
              <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text, fontSize: "2rem", lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                {stat.helper}
              </Typography>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}
