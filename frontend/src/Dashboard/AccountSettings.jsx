import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { BOOKNEST_COLORS } from "../utils/profile";

export default function AccountSettings() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        border: `1px solid ${BOOKNEST_COLORS.border}`,
        backgroundColor: BOOKNEST_COLORS.card,
      }}
    >
      <Stack spacing={2}>
        <Avatar
          sx={{
            bgcolor: "rgba(200, 154, 79, 0.18)",
            color: BOOKNEST_COLORS.primaryBrown,
            width: 52,
            height: 52,
          }}
        >
          <SettingsRoundedIcon />
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This section is wired into the dashboard navigation and ready for future account
          preferences like notifications, password management, and security controls.
        </Typography>
      </Stack>
    </Paper>
  );
}
