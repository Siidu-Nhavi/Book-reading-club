import {
  Box,
  Button,
} from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function FilterBar({
  onOpenMobileFilters,
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
          justifyContent: { xs: "space-between", md: "flex-end" },
          flexWrap: "nowrap",
        }}
      >


        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
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
