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
				backgroundColor: PUBLIC_UI.pageBackground,
			}}
		>
			<AppNavbar />
			<Box sx={{ height: 72 }} />
			<Outlet />
			<AppFooter />
		</Box>
	);
}
