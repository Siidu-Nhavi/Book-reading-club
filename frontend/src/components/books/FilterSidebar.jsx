import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { formatBookPrice } from "../../utils/books";
import { PUBLIC_UI } from "../../utils/publicUi";
import CategoryCard from "./CategoryCard";

export default function FilterSidebar({
  categoryOptions,
  selectedCategories,
  onToggleCategory,
  availability,
  onAvailabilityChange,
  minRating,
  onRatingChange,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  sortBy,
  sortOptions,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}) {
  const categoryEntries = [
    { label: "All Books", value: "__all__", count: categoryOptions.reduce((sum, item) => sum + item.count, 0) },
    ...categoryOptions,
  ];

  const isAllBooksSelected = selectedCategories.length === 0;

  return (
    <Stack spacing={2.75}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
          Filters
        </Typography>
        {hasActiveFilters ? (
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
        ) : null}
      </Stack>

      <Divider />

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary }} />} sx={{ px: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Stack spacing={1.1}>
            {categoryEntries.map((category) => (
              <CategoryCard
                key={category.value}
                category={category.label}
                count={category.count}
                selected={category.value === "__all__" ? isAllBooksSelected : selectedCategories.includes(category.value)}
                onClick={() => {
                  if (category.value === "__all__") {
                    onClearFilters();
                    return;
                  }
                  onToggleCategory(category.value);
                }}
                variant="compact"
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary }} />} sx={{ px: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            Availability
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <RadioGroup value={availability} onChange={(event) => onAvailabilityChange(event.target.value)}>
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="available" control={<Radio />} label="Available Now" />
            <FormControlLabel value="coming_soon" control={<Radio />} label="Coming Soon" />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary }} />} sx={{ px: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            Rental Price (per week)
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Slider
            value={priceRange}
            min={priceBounds.min}
            max={priceBounds.max}
            onChangeCommitted={(_, value) => onPriceRangeChange(value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatBookPrice(value)}
            sx={{ color: PUBLIC_UI.primary }}
          />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
              {formatBookPrice(priceRange[0])}
            </Typography>
            <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
              {formatBookPrice(priceRange[1])}
            </Typography>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary }} />} sx={{ px: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            Minimum Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Stack spacing={1}>
            {[0, 1, 2, 3, 4, 5].map((value) => (
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
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary }} />} sx={{ px: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            Sort By
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <RadioGroup value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            {sortOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
