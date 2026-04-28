import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { PUBLIC_BUTTON_GHOST_SX, PUBLIC_UI } from "../../utils/publicUi";

export default function ResultsBar({
  totalCount,
  page,
  pageSize,
  search,
  sortBy,
  sortOptions,
  onSortChange,
  onOpenFilters,
}) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      sx={{
        pb: 2,
        borderBottom: `1px solid ${PUBLIC_UI.border}`,
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
      }}
    >
      <Box>
        <Typography sx={{ color: PUBLIC_UI.muted, fontSize: "0.88rem" }}>
          Showing {start}-{end} of {totalCount} books
        </Typography>
        {search ? (
          <Typography sx={{ color: PUBLIC_UI.text, fontSize: "0.88rem", mt: 0.4 }}>
            Results for "{search}"
          </Typography>
        ) : null}
      </Box>

      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
        {/* Mobile: Show filter button */}
        <Button
          startIcon={<FilterListRoundedIcon />}
          variant="outlined"
          onClick={onOpenFilters}
          size="small"
          sx={{
            ...PUBLIC_BUTTON_GHOST_SX,
            borderRadius: 2,
            minHeight: 36,
            display: { xs: "inline-flex", md: "none" },
          }}
        >
          Filters
        </Button>

        {/* Sort dropdown - shown on mobile and tablet only */}
        <FormControl size="small" sx={{ minWidth: 180, display: { xs: "flex", md: "none" } }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            label="Sort by"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
