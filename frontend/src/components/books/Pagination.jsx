import { Button, Pagination, Stack } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function BooksPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={1.1}
      sx={{ mt: 4.5, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}
    >
      <Button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          borderRadius: 999,
          border: `1px solid ${PUBLIC_UI.border}`,
          color: PUBLIC_UI.text,
          textTransform: "none",
          px: 1.5,
          minHeight: 36,
        }}
      >
        Prev
      </Button>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, nextPage) => onChange(nextPage)}
        shape="rounded"
        siblingCount={1}
        boundaryCount={2}
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: 2.5,
            border: `1px solid ${PUBLIC_UI.border}`,
            color: PUBLIC_UI.text,
          },
          "& .MuiPaginationItem-root:hover": {
            borderColor: PUBLIC_UI.accent,
            color: PUBLIC_UI.accent,
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            bgcolor: PUBLIC_UI.text,
            color: "#fff",
            borderColor: PUBLIC_UI.text,
          },
        }}
      />

      <Button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        endIcon={<ArrowForwardRoundedIcon />}
        sx={{
          borderRadius: 999,
          border: `1px solid ${PUBLIC_UI.border}`,
          color: PUBLIC_UI.text,
          textTransform: "none",
          px: 1.5,
          minHeight: 36,
        }}
      >
        Next
      </Button>
    </Stack>
  );
}
