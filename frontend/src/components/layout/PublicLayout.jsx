import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PUBLIC_UI } from "../../utils/publicUi";
import PublicFooter from "./PublicFooter";
import PublicNavbar from "./PublicNavbar";

export default function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${PUBLIC_UI.pageTop} 0px, ${PUBLIC_UI.pageTopDark} 340px, ${PUBLIC_UI.pageBackground} 340px, ${PUBLIC_UI.pageBackground} 100%)`,
      }}
    >
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </Box>
  );
}
