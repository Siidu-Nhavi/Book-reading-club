import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SearchBar from "../common/SearchBar";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function FilterBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  categoryOptions,
  selectedCategories,
  onCategorySelect,
  availability,
  onAvailabilityChange,
  sortBy,
  sortOptions,
  onSortChange,
  onOpenMobileFilters,
  onClearFilters,
}) {
  return (
    <Box
      sx={{
        position: { xs: "static", md: "sticky" },
        top: "var(--navbar-height)",
        zIndex: 100,
        backgroundColor: PUBLIC_UI.surface,
        borderBottom: `1px solid ${PUBLIC_UI.border}`,
      }}
    >
      <Box
        sx={{
          maxWidth: "var(--max-width-page)",
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 1.2 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(320px, 40%) minmax(190px, 220px) auto auto" },
          gap: 1.25,
          alignItems: "center",
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          size="small"
          placeholder="Search by title, author, or ISBN"
          sx={{
            "& .MuiOutlinedInput-root": {
              minHeight: 40,
              borderRadius: 2,
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 190, display: { xs: "none", md: "flex" } }}>
          <Select
            value={selectedCategories.length === 1 ? selectedCategories[0] : ""}
            onChange={(event) => onCategorySelect(event.target.value)}
            displayEmpty
            sx={{ borderRadius: 2, backgroundColor: PUBLIC_UI.surface }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categoryOptions.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180, display: { xs: "none", md: "flex" } }}>
          <Select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            sx={{ borderRadius: 2, backgroundColor: PUBLIC_UI.surface }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={availability}
          onChange={(_, next) => {
            if (next) {
              onAvailabilityChange(next);
            }
          }}
          sx={{
            display: { xs: "none", md: "inline-flex" },
            "& .MuiToggleButton-root": {
              textTransform: "none",
              borderColor: PUBLIC_UI.borderStrong,
              color: PUBLIC_UI.muted,
              px: 1.1,
            },
            "& .MuiToggleButton-root.Mui-selected": {
              color: PUBLIC_UI.primary,
              backgroundColor: PUBLIC_UI.primarySoft,
            },
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="available">Available</ToggleButton>
          <ToggleButton value="coming_soon">Soon</ToggleButton>
        </ToggleButtonGroup>

        <Button
          size="small"
          variant="outlined"
          onClick={onClearFilters}
          sx={{
            display: { xs: "none", lg: "inline-flex" },
            textTransform: "none",
            borderRadius: 2,
            borderColor: PUBLIC_UI.borderStrong,
            color: PUBLIC_UI.muted,
            minHeight: 40,
          }}
        >
          Clear
        </Button>

        <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: PUBLIC_UI.muted, fontSize: "0.86rem" }}>
            Refine results
          </Typography>
          <Button
            variant="outlined"
            onClick={onOpenMobileFilters}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: PUBLIC_UI.borderStrong,
              color: PUBLIC_UI.text,
              minHeight: 36,
            }}
          >
            Filter & Sort
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
