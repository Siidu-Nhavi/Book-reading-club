import {
  Box,
  Button,
} from "@mui/material";
import SearchBar from "../common/SearchBar";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function FilterBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
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
          display: "flex",
          gap: 1.25,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "center",
            flex: { xs: "1 1 100%", md: "1" },
            width: { xs: "100%", md: "auto" },
            order: { xs: 1, md: 0 },
          }}
        >
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            size="small"
            placeholder="Search by title or author"
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                minHeight: 40,
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Desktop: Hidden filter controls (now in sidebar) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onClearFilters}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: PUBLIC_UI.borderStrong,
              color: PUBLIC_UI.muted,
              minHeight: 40,
              fontSize: "0.9rem",
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Mobile: Filter & Sort Button */}
        <Box 
          sx={{ 
            display: { xs: "flex", md: "none" }, 
            alignItems: "center",
            order: { xs: 2, md: 0 },
          }}
        >
          <Button
            variant="outlined"
            onClick={onOpenMobileFilters}
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: PUBLIC_UI.borderStrong,
              color: PUBLIC_UI.text,
              minHeight: 36,
              whiteSpace: "nowrap",
            }}
          >
            Filter & Sort
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
