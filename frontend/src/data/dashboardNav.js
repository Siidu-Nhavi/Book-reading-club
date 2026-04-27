import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";

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
    label: "My Rentals",
    to: "/dashboard/rentals",
    icon: AssignmentReturnRoundedIcon,
  },
  {
    label: "Wallet",
    to: "/dashboard/wallet",
    icon: AccountBalanceWalletRoundedIcon,
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
    label: "Admin Wallets",
    to: "/dashboard/admin/wallets",
    icon: ManageAccountsRoundedIcon,
    roles: ["admin"],
  },
  {
    label: "Admin Returns",
    to: "/dashboard/admin/returns",
    icon: AssignmentReturnRoundedIcon,
    roles: ["admin"],
  },
];
