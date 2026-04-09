import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by title or author",
  size = "medium",
  fullWidth = true,
  sx,
}) {
  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSubmit?.();
        }
      }}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: PUBLIC_UI.muted }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Clear search"
                onClick={() => onChange("")}
                edge="end"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: PUBLIC_UI.surface,
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 8px 20px rgba(94, 86, 180, 0.08)",
          "& fieldset": {
            borderColor: PUBLIC_UI.border,
          },
          "&:hover fieldset": {
            borderColor: PUBLIC_UI.borderStrong,
          },
          "&.Mui-focused fieldset": {
            borderColor: PUBLIC_UI.primary,
            boxShadow: "0 0 0 4px rgba(108, 92, 231, 0.1)",
          },
        },
        ...sx,
      }}
    />
  );
}
