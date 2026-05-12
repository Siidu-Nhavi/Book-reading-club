import { Box, Typography } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";
import { formatBookPrice } from "../../utils/books";

function getBookDetails(book = {}) {
  return [
    { label: "Book Price", value: Number.isFinite(book.rentPrice) ? formatBookPrice(book.rentPrice) : "N/A" },
    { label: "Deposit", value: Number.isFinite(book.depositAmount) ? formatBookPrice(book.depositAmount) : "N/A" },
    { label: "Publisher", value: book.publisher || "N/A" },
    { label: "Edition", value: book.edition || "N/A" },
    { label: "Language", value: book.language || "English" },
    { label: "Pages", value: book.pages || "N/A" },
    { label: "ISBN", value: book.isbn || "N/A" },
    { label: "Subject", value: book.subject || book.category || "N/A" },
  ];
}

export default function BookDetailColumns({ book }) {
  const details = getBookDetails(book);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.3,
      }}
    >
      {details.map((item) => (
        <Box
          key={item.label}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: `1px solid ${PUBLIC_UI.border}`,
            bgcolor: PUBLIC_UI.surface,
          }}
        >
          <Typography variant="caption" sx={{ color: PUBLIC_UI.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {item.label}
          </Typography>
          <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 700, mt: 0.4 }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
