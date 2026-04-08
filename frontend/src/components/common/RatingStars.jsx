import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Box, Typography } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function RatingStars({
  rating = 0,
  count,
  size = "small",
  textColor = PUBLIC_UI.muted,
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.65 }}>
      <Box sx={{ display: "flex", alignItems: "center", color: PUBLIC_UI.accent }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <StarRoundedIcon
            key={`rating-star-${index + 1}`}
            fontSize={size}
            sx={{
              opacity: index < Math.round(rating) ? 1 : 0.24,
            }}
          />
        ))}
      </Box>
      <Typography variant="body2" sx={{ color: textColor, fontWeight: 600 }}>
        {rating.toFixed(1)}
        {typeof count === "number" ? ` (${count})` : ""}
      </Typography>
    </Box>
  );
}
