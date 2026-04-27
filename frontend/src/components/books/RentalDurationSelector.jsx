import {
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

const TYPE_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const DURATION_OPTIONS = {
  daily: Array.from({ length: 30 }, (_, index) => index + 1),
  weekly: [1, 2, 3, 4],
  monthly: [1, 2, 3],
};

export default function RentalDurationSelector({
  rentalType,
  rentalDuration,
  onTypeChange,
  onDurationChange,
}) {
  const options = DURATION_OPTIONS[rentalType] || DURATION_OPTIONS.daily;

  return (
    <Stack spacing={1.3}>
      <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
        Rental duration
      </Typography>

      <ToggleButtonGroup
        value={rentalType}
        exclusive
        onChange={(_, nextValue) => {
          if (nextValue) {
            onTypeChange(nextValue);
          }
        }}
        sx={{ flexWrap: "wrap", gap: 1 }}
      >
        {TYPE_OPTIONS.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            sx={{
              borderRadius: "12px !important",
              border: `1px solid ${PUBLIC_UI.border} !important`,
              px: 1.8,
              textTransform: "none",
              fontWeight: 700,
              "&.Mui-selected": {
                bgcolor: PUBLIC_UI.primarySoft,
                color: PUBLIC_UI.primary,
              },
            }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TextField
        select
        label="Duration"
        value={rentalDuration}
        onChange={(event) => onDurationChange(Number(event.target.value))}
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option} {rentalType === "daily" ? "day" : rentalType === "weekly" ? "week" : "month"}
            {option > 1 ? "s" : ""}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
