import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PUBLIC_BUTTON_PRIMARY_SX, PUBLIC_UI } from "../../utils/publicUi";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  icon,
}) {
  const IconComponent = icon || MenuBookRoundedIcon;

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: 280,
        p: 4,
        textAlign: "center",
        borderRadius: 5,
        border: `1px dashed ${PUBLIC_UI.borderStrong}`,
        bgcolor: "rgba(255, 255, 255, 0.82)",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: PUBLIC_UI.primarySoft,
          color: PUBLIC_UI.primary,
        }}
      >
        <IconComponent fontSize="large" />
      </Box>
      <Box>
        <Typography variant="h6" sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: PUBLIC_UI.muted, mt: 1, maxWidth: 460 }}>
          {description}
        </Typography>
      </Box>
      {actionLabel && actionTo ? (
        <Button
          component={Link}
          to={actionTo}
          variant="contained"
          sx={{
            ...PUBLIC_BUTTON_PRIMARY_SX,
            borderRadius: 3,
            textTransform: "none",
            px: 3,
          }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}
