import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import { Box, Stack, Typography } from "@mui/material";
import { BOOKNEST_COLORS } from "../../utils/profile";

const TONE_COLORS = {
  primary: BOOKNEST_COLORS.primaryBrown,
  accent: BOOKNEST_COLORS.gold,
  muted: BOOKNEST_COLORS.muted,
};

export default function DashboardActivityList({ items = [] }) {
  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            borderRadius: 2.5,
            p: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
            <FiberManualRecordRoundedIcon
              sx={{
                fontSize: 14,
                color: TONE_COLORS[item.tone] || TONE_COLORS.primary,
                mt: 0.45,
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 600, color: BOOKNEST_COLORS.text }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted, mt: 0.35 }}>
                {item.description}
              </Typography>
              <Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted, display: "block", mt: 1 }}>
                {item.timeLabel}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
