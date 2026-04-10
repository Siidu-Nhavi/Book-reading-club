import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";
import { useAuth } from "../context/useAuth";
import { BOOKNEST_COLORS, getUserInitials } from "../utils/profile";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const userSummary = {
    name: user?.name || "Reader",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    initials: getUserInitials(user?.name, user?.email),
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BOOKNEST_COLORS.cream, display: "flex" }}>
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: 280,
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <DashboardSidebar compact={false} />
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "block", lg: "none" },
          width: 96,
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <DashboardSidebar compact />
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box sx={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        <DashboardTopbar userSummary={userSummary} onOpenSidebar={() => setMobileOpen(true)} />
        <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 3 }, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
