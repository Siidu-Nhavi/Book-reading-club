import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  loading = false,
  itemName = "",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Modal Header with Icon */}
      <Box
        sx={{
          p: 3,
          bgcolor: "#fff3cd",
          borderBottom: "1px solid #ffc107",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <DeleteIcon sx={{ fontSize: 32, color: "#d32f2f" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#d32f2f", margin: 0 }}>
          {title}
        </Typography>
      </Box>

      {/* Modal Content */}
      <Box sx={{ p: 3 }}>
        <Typography sx={{ mb: 2, color: "#666", lineHeight: 1.6 }}>
          {message}
        </Typography>
        {itemName && (
          <Box
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #ddd",
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "#999", mb: 0.5 }}>
              Item to be deleted:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: "#333", wordBreak: "break-word" }}>
              {itemName}
            </Typography>
          </Box>
        )}
        <Typography variant="caption" sx={{ color: "#999", display: "block" }}>
          ⚠️ This action cannot be undone.
        </Typography>
      </Box>

      {/* Modal Actions */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#f9f9f9",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#ddd",
            color: "#666",
            "&:hover": { bgcolor: "#f5f5f5", borderColor: "#999" },
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: "#d32f2f",
            "&:hover": { bgcolor: "#b71c1c" },
          }}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Box>
    </Dialog>
  );
}
