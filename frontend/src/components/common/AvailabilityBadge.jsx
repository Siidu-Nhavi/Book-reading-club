import { Chip } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function AvailabilityBadge({ available = true }) {
  return (
    <Chip
      label={available ? "Available" : "Rented"}
      size="small"
      sx={{
        bgcolor: available ? "rgba(63, 175, 116, 0.12)" : "rgba(224, 90, 118, 0.12)",
        color: available ? PUBLIC_UI.success : PUBLIC_UI.danger,
        borderRadius: 999,
        fontWeight: 700,
        border: `1px solid ${available ? "rgba(63, 175, 116, 0.16)" : "rgba(224, 90, 118, 0.16)"}`,
      }}
    />
  );
}
