import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { formatBookPrice } from "../../utils/books";
import { PUBLIC_UI } from "../../utils/publicUi";
import CategoryCard from "./CategoryCard";

export default function FilterSidebar({
  categorySummaries,
  selectedCategories,
  onToggleCategory,
  availability,
  onAvailabilityChange,
  minRating,
  onRatingChange,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  onClearFilters,
}) {
  return (
    <Stack spacing={2.75}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
          Filters
        </Typography>
        <Button
          size="small"
          onClick={onClearFilters}
          startIcon={<RestartAltRoundedIcon />}
          sx={{
            textTransform: "none",
            color: PUBLIC_UI.primary,
            fontWeight: 700,
            borderRadius: 2.5,
          }}
        >
          Clear Filters
        </Button>
      </Stack>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2, color: PUBLIC_UI.text }}>
          Category
        </Typography>
        <Stack spacing={1.1}>
          {categorySummaries.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              count={category.count}
              selected={selectedCategories.includes(category.name)}
              onClick={() => onToggleCategory(category.name)}
              variant="compact"
            />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2, color: PUBLIC_UI.text }}>
          Availability
        </Typography>
        <RadioGroup value={availability} onChange={(event) => onAvailabilityChange(event.target.value)}>
          <FormControlLabel value="all" control={<Radio />} label="All" />
          <FormControlLabel value="available" control={<Radio />} label="Available Now" />
        </RadioGroup>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2, color: PUBLIC_UI.text }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          min={priceBounds.min}
          max={priceBounds.max}
          onChange={(_, value) => onPriceRangeChange(value)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatBookPrice(value)}
          sx={{ color: PUBLIC_UI.primary }}
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
            {formatBookPrice(priceRange[0])}
          </Typography>
          <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
            {formatBookPrice(priceRange[1])}
          </Typography>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2, color: PUBLIC_UI.text }}>
          Rating
        </Typography>
        <Stack spacing={1}>
          {[0, 4, 4.5].map((value) => (
            <Button
              key={`rating-filter-${value}`}
              variant={minRating === value ? "contained" : "outlined"}
              startIcon={<StarRoundedIcon />}
              onClick={() => onRatingChange(value)}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 3,
                textTransform: "none",
                color: minRating === value ? "#fff" : PUBLIC_UI.primary,
                bgcolor: minRating === value ? PUBLIC_UI.primary : "transparent",
                borderColor: PUBLIC_UI.border,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderColor: PUBLIC_UI.primary,
                },
              }}
            >
              {value === 0 ? "All ratings" : `${value}+ stars`}
            </Button>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
