import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppFooter from "../components/shared/AppFooter";
import AppNavbar from "../components/shared/AppNavbar";
import { PUBLIC_UI } from "../utils/publicUi";

export default function PublicLayout() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: `linear-gradient(180deg, ${PUBLIC_UI.pageTop} 0px, ${PUBLIC_UI.pageTopDark} 340px, ${PUBLIC_UI.pageBackground} 340px, ${PUBLIC_UI.pageBackground} 100%)`,
			}}
		>
			<AppNavbar />
			<Box sx={{ height: 64 }} />
			<Outlet />
			<AppFooter />
		</Box>
	);
}
