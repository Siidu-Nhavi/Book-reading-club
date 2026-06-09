import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
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
    label: "Payment Methods",
    to: "/dashboard/profile/payment",
    icon: CreditCardRoundedIcon,
  },
  {
    label: "My Rentals",
    to: "/dashboard/rentals",
    icon: AssignmentReturnRoundedIcon,
  },
  {
    label: "My Listings",
    to: "/dashboard/listings",
    icon: MenuBookRoundedIcon,
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
  {
    label: "Admin Users",
    to: "/dashboard/admin/users",
    icon: ManageAccountsRoundedIcon,
    roles: ["admin"],
  },
  {
    label: "Admin Books",
    to: "/dashboard/admin/books",
    icon: MenuBookRoundedIcon,
    roles: ["admin"],
  },
  {
    label: "Admin Rentals",
    to: "/dashboard/admin/rentals",
    icon: AssignmentReturnRoundedIcon,
    roles: ["admin"],
  },
  {
    label: "Admin Reviews",
    to: "/dashboard/admin/reviews",
    icon: SupportAgentRoundedIcon,
    roles: ["admin"],
  },
  {
    label: "Admin Returns",
    to: "/dashboard/admin/returns",
    icon: AssignmentReturnRoundedIcon,
    roles: ["admin"],
  },
];
