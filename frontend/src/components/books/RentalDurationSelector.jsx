import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

const DEFAULT_OPTIONS = [
  { label: "1 Week", value: 7 },
  { label: "2 Weeks", value: 14 },
  { label: "1 Month", value: 30 },
];

export default function RentalDurationSelector({ value, onChange, options = DEFAULT_OPTIONS }) {
  return (
    <Stack spacing={1.1}>
      <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>Rental Duration</Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, nextValue) => {
          if (!nextValue) {
            return;
          }
          onChange(nextValue);
        }}
        sx={{ flexWrap: "wrap", gap: 1 }}
      >
        {options.map((option) => (
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
    </Stack>
  );
}
