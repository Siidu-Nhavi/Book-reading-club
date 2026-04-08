import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";
import LocalLibraryRoundedIcon from "@mui/icons-material/LocalLibraryRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, Checkbox, Paper, Stack, Typography } from "@mui/material";
import { formatCategoryLabel, getBookGradient } from "../../utils/books";
import { PUBLIC_CARD_SX, PUBLIC_UI } from "../../utils/publicUi";

const CATEGORY_ICON_MAP = {
  fiction: AutoStoriesRoundedIcon,
  mystery: LocalLibraryRoundedIcon,
  romance: FavoriteRoundedIcon,
  biography: HistoryEduRoundedIcon,
  science: ScienceRoundedIcon,
  selfhelp: PsychologyRoundedIcon,
};

function getCategoryIcon(category = "") {
  const normalized = category.toLowerCase().replace(/[^a-z]/g, "");
  return CATEGORY_ICON_MAP[normalized] || AutoStoriesRoundedIcon;
}

function renderCategoryIcon(category, props = {}) {
  const Icon = getCategoryIcon(category);
  return <Icon {...props} />;
}

export default function CategoryCard({
  category,
  count,
  onClick,
  selected = false,
  variant = "default",
}) {
  const compact = variant === "compact";

  if (compact) {
    return (
      <Paper
        elevation={0}
        onClick={onClick}
        sx={{
          p: 1.5,
          borderRadius: 4,
          border: `1px solid ${selected ? PUBLIC_UI.primary : PUBLIC_UI.border}`,
          bgcolor: selected ? PUBLIC_UI.primarySoft : PUBLIC_UI.surface,
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 8px 20px rgba(94, 86, 180, 0.06)",
          "&:hover": {
            borderColor: PUBLIC_UI.primary,
          },
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Checkbox
            checked={selected}
            size="small"
            sx={{ p: 0.25, color: PUBLIC_UI.primary }}
          />
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
                background: getBookGradient(category),
                color: "#fff",
            }}
          >
            {renderCategoryIcon(category, { fontSize: "small" })}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: PUBLIC_UI.text }}>
              {formatCategoryLabel(category)}
            </Typography>
            <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
              {count} books
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        ...PUBLIC_CARD_SX,
        p: PUBLIC_UI.cardPadding,
        cursor: "pointer",
        minHeight: 184,
      }}
    >
      <Stack spacing={2.5} sx={{ height: "100%" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            background: getBookGradient(category),
            color: "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          {renderCategoryIcon(category)}
        </Box>
        <Box sx={{ mt: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            {formatCategoryLabel(category)}
          </Typography>
          <Typography variant="body2" sx={{ color: PUBLIC_UI.muted, mt: 0.5 }}>
            {count} books available in this shelf
          </Typography>
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto" }}>
          <Typography variant="body2" sx={{ color: PUBLIC_UI.primary, fontWeight: 800 }}>
            Explore
          </Typography>
          <ChevronRightRoundedIcon sx={{ color: PUBLIC_UI.primary }} />
        </Stack>
      </Stack>
    </Paper>
  );
}
