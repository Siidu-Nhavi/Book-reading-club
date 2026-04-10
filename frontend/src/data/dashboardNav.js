import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";

export const dashboardNavItems = [
  {
    label: "Overview",
    to: "/dashboard",
    icon: DashboardRoundedIcon,
    exact: true,
  },
  {
    label: "Edit Profile",
    to: "/dashboard/profile",
    icon: EditRoundedIcon,
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: SettingsRoundedIcon,
  },
  {
    label: "Browse Books",
    to: "/books",
    icon: MenuBookRoundedIcon,
  },
  {
    label: "Support",
    to: "/support",
    icon: SupportAgentRoundedIcon,
  },
];
