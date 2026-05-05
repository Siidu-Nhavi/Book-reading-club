import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useEffect, useState } from "react";
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

const FILTER_SECTION_SX = {
  bgcolor: PUBLIC_UI.surface,
  border: `1px solid ${PUBLIC_UI.border}`,
  borderRadius: 2,
  overflow: "hidden",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: PUBLIC_UI.primary,
    boxShadow: `0 2px 8px ${PUBLIC_UI.primary}15`,
  },
};

const ACCORDION_SX = {
  ...FILTER_SECTION_SX,
  "&:not(:last-of-type)": {
    mb: 0.8,
  },
  "&.MuiAccordion-root": {
    margin: 0,
    elevation: 0,
    "&:before": { display: "none" },
    "&.Mui-expanded": {
      margin: 0,
    },
  },
};

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
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const categoryEntries = [
    { label: "All Books", value: "__all__", count: categoryOptions.reduce((sum, item) => sum + item.count, 0) },
    ...categoryOptions,
  ];

  const isAllBooksSelected = selectedCategories.length === 0;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", px: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
          Filters
        </Typography>
        {hasActiveFilters ? (
          <Button
            size="small"
            onClick={onClearFilters}
            startIcon={<RestartAltRoundedIcon sx={{ fontSize: "1.1rem" }} />}
            sx={{
              textTransform: "none",
              color: PUBLIC_UI.primary,
              fontWeight: 700,
              fontSize: "0.85rem",
              borderRadius: 2.5,
              p: "4px 8px",
              minHeight: "auto",
            }}
          >
            Reset
          </Button>
        ) : null}
      </Stack>

      <Accordion 
        defaultExpanded 
        disableGutters 
        sx={ACCORDION_SX}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary, fontSize: "1.3rem" }} />} 
          sx={{ 
            px: 1.5, 
            py: 1,
            minHeight: "auto",
            "&.Mui-expanded": { minHeight: "auto" },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text, fontSize: "0.95rem" }}>
            Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, py: 1, pt: 0 }}>
          <Stack spacing={0.75}>
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

      <Accordion 
        defaultExpanded 
        disableGutters 
        sx={ACCORDION_SX}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary, fontSize: "1.3rem" }} />} 
          sx={{ 
            px: 1.5, 
            py: 1,
            minHeight: "auto",
            "&.Mui-expanded": { minHeight: "auto" },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text, fontSize: "0.95rem" }}>
            Availability
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, py: 1, pt: 0 }}>
          <RadioGroup value={availability} onChange={(event) => onAvailabilityChange(event.target.value)}>
            <FormControlLabel 
              value="all" 
              control={<Radio size="small" />} 
              label={<Typography sx={{ fontSize: "0.9rem" }}>All</Typography>} 
              sx={{ mb: 0.3 }}
            />
            <FormControlLabel 
              value="available" 
              control={<Radio size="small" />} 
              label={<Typography sx={{ fontSize: "0.9rem" }}>Available Now</Typography>} 
              sx={{ mb: 0.3 }}
            />
            <FormControlLabel 
              value="coming_soon" 
              control={<Radio size="small" />} 
              label={<Typography sx={{ fontSize: "0.9rem" }}>Coming Soon</Typography>} 
            />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        defaultExpanded 
        disableGutters 
        sx={ACCORDION_SX}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary, fontSize: "1.3rem" }} />} 
          sx={{ 
            px: 1.5, 
            py: 1,
            minHeight: "auto",
            "&.Mui-expanded": { minHeight: "auto" },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text, fontSize: "0.95rem" }}>
            Rental Price
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, py: 1.2, pt: 0.5 }}>
          <Slider
            value={localPriceRange}
            min={priceBounds.min}
            max={priceBounds.max}
            onChange={(_, value) => {
              if (Array.isArray(value)) {
                setLocalPriceRange(value);
              }
            }}
            onChangeCommitted={(_, value) => {
              if (Array.isArray(value)) {
                onPriceRangeChange(value);
              }
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatBookPrice(value)}
            step={1}
            disableSwap
            sx={{ 
              color: PUBLIC_UI.primary,
              mb: 1,
              "& .MuiSlider-thumb": {
                transition: "transform 0.12s ease",
              },
              "& .MuiSlider-track, & .MuiSlider-rail": {
                transition: "all 0.18s ease",
              },
              "& .MuiSlider-markLabel": {
                fontSize: "0.75rem",
              }
            }}
          />
          <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ 
              bgcolor: PUBLIC_UI.primarySoft, 
              px: 1, 
              py: 0.5, 
              borderRadius: 1.5,
              minWidth: "50%",
            }}>
              <Typography variant="caption" sx={{ color: PUBLIC_UI.primary, fontWeight: 600 }}>
                {formatBookPrice(localPriceRange[0])}
              </Typography>
            </Box>
            <Box sx={{ 
              bgcolor: PUBLIC_UI.primarySoft, 
              px: 1, 
              py: 0.5, 
              borderRadius: 1.5,
              minWidth: "50%",
            }}>
              <Typography variant="caption" sx={{ color: PUBLIC_UI.primary, fontWeight: 600 }}>
                {formatBookPrice(localPriceRange[1])}
              </Typography>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        defaultExpanded 
        disableGutters 
        sx={ACCORDION_SX}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary, fontSize: "1.3rem" }} />} 
          sx={{ 
            px: 1.5, 
            py: 1,
            minHeight: "auto",
            "&.Mui-expanded": { minHeight: "auto" },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text, fontSize: "0.95rem" }}>
            Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, py: 1, pt: 0 }}>
          <Stack spacing={0.6}>
            {[0, 1, 2, 3, 4, 5].map((value) => (
              <Button
                key={`rating-filter-${value}`}
                variant={minRating === value ? "contained" : "outlined"}
                startIcon={<StarRoundedIcon sx={{ fontSize: "0.95rem" }} />}
                onClick={() => onRatingChange(value)}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  p: "6px 10px",
                  minHeight: "auto",
                  color: minRating === value ? "#fff" : PUBLIC_UI.primary,
                  bgcolor: minRating === value ? PUBLIC_UI.primary : "transparent",
                  borderColor: PUBLIC_UI.border,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    borderColor: PUBLIC_UI.primary,
                    bgcolor: minRating === value ? PUBLIC_UI.primary : PUBLIC_UI.primarySoft,
                  },
                }}
              >
                {value === 0 ? "All ratings" : `${value}+ stars`}
              </Button>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        defaultExpanded 
        disableGutters 
        sx={ACCORDION_SX}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary, fontSize: "1.3rem" }} />} 
          sx={{ 
            px: 1.5, 
            py: 1,
            minHeight: "auto",
            "&.Mui-expanded": { minHeight: "auto" },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text, fontSize: "0.95rem" }}>
            Sort By
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, py: 1, pt: 0 }}>
          <RadioGroup value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            {sortOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: "0.9rem" }}>{option.label}</Typography>}
                sx={{ mb: 0.3 }}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
