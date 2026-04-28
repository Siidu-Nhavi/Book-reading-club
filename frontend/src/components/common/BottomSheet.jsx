import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function BottomSheet({ 
  open, 
  onClose, 
  title = "Filter & Sort", 
  children,
  anchor = "right"
}) {
  const isBottomAnchor = anchor === "bottom";
  
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isBottomAnchor && {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }),
          border: `1px solid ${PUBLIC_UI.border}`,
          backgroundColor: PUBLIC_UI.surface,
          ...(isBottomAnchor && { maxHeight: "86vh" }),
          width: { xs: "100%", sm: "100%" },
          maxWidth: { md: "320px" },
          overflowY: "auto",
        },
      }}
    >
      <Stack spacing={2.2} sx={{ p: { xs: 2, sm: 3 }, minHeight: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: PUBLIC_UI.surface,
            zIndex: 10,
            pb: 1,
          }}
        >
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: PUBLIC_UI.text }}>
            {title}
          </Typography>
          <IconButton aria-label="Close" onClick={onClose} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {children}
      </Stack>
    </Drawer>
  );
}
