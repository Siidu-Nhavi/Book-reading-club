import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import { BOOKNEST_COLORS } from "../utils/profile";

export default function DashboardLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BOOKNEST_COLORS.cream }}>
      <DashboardNavbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
