import { Box, Typography, Chip } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";
import { formatBookPrice } from "../../utils/books";

export default function DepositDisplay({ deposit, variant = "default" }) {
  if (variant === "chip") {
    return (
      <Chip
        label={`Deposit: ${formatBookPrice(deposit)}`}
        sx={{
          backgroundColor: PUBLIC_UI.surfaceSoft,
          color: PUBLIC_UI.text,
          fontWeight: 600,
          "& .MuiChip-label": {
            padding: "8px 12px",
          },
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        p: 1.8,
        borderRadius: 2,
        border: `1px solid ${PUBLIC_UI.border}`,
        bgcolor: PUBLIC_UI.surfaceSoft,
      }}
    >
      <Typography variant="caption" sx={{ color: PUBLIC_UI.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Available Deposit
      </Typography>
      <Typography sx={{ color: PUBLIC_UI.primary, fontWeight: 700, mt: 0.4, fontSize: "1.25rem" }}>
        {formatBookPrice(deposit)}
      </Typography>
    </Box>
  );
}
