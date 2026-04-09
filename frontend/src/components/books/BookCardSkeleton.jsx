import { Box } from "@mui/material";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function BookCardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${PUBLIC_UI.border}`,
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ height: 200, position: "relative", overflow: "hidden", bgcolor: "#f2f3fb" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 45%, rgba(255,255,255,0) 100%)",
            transform: "translateX(-100%)",
            animation: "booknestShimmer 1.35s infinite",
          }}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ height: 24, borderRadius: 1, bgcolor: "#eceffd", mb: 1.1 }} />
        <Box sx={{ height: 16, borderRadius: 1, bgcolor: "#f1f3fd", width: "74%", mb: 1.3 }} />
        <Box sx={{ height: 14, borderRadius: 1, bgcolor: "#f1f3fd", width: "58%", mb: 1.7 }} />
      </Box>

      <Box sx={{ borderTop: `1px solid ${PUBLIC_UI.border}`, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ height: 20, borderRadius: 1, bgcolor: "#eceffd", width: 96 }} />
        <Box sx={{ height: 32, borderRadius: 999, bgcolor: "#fde6d4", width: 96 }} />
      </Box>

      <style>
        {`@keyframes booknestShimmer { 100% { transform: translateX(100%); } }`}
      </style>
    </Box>
  );
}
