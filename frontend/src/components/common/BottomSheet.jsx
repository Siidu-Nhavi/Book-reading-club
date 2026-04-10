import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function BottomSheet({ open, onClose, title = "Filter & Sort", children }) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          border: `1px solid ${PUBLIC_UI.border}`,
          backgroundColor: PUBLIC_UI.surface,
          maxHeight: "86vh",
        },
      }}
    >
      <Stack spacing={2.2} sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: PUBLIC_UI.text }}>
            {title}
          </Typography>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {children}
      </Stack>
    </Drawer>
  );
}
