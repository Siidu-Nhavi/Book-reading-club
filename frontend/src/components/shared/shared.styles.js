import { PUBLIC_UI } from "../../utils/publicUi";

// AppNavbar
export const appNavbarStyles = {
  appBar: {
    bgcolor: "rgba(255, 255, 255, 0.96)",
    color: PUBLIC_UI.text,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${PUBLIC_UI.border}`,
    top: 0,
    left: 0,
    right: 0,
  },
  inner: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: { xs: 2, md: 3 },
    maxWidth: "var(--max-width-page)",
    mx: "auto",
    gap: 2,
  },
  brandStack: {
    minWidth: { xs: "auto", md: 210 },
    alignItems: "center",
  },
  backButton: {
    textTransform: "none",
    fontWeight: 500,
    color: PUBLIC_UI.primary,
    display: { xs: "none", md: "inline-flex" },
    minWidth: "fit-content",
    px: 0.6,
  },
  logoAvatar: {
    width: 42,
    height: 42,
    bgcolor: PUBLIC_UI.primary,
    color: "#fff",
  },
  logoIcon: {
    fontSize: 24,
  },
  logoLink: {
    textDecoration: "none",
    color: "inherit",
  },
  logoTitle: {
    fontWeight: 700,
    fontSize: "1.12rem",
  },
  searchWrap: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    px: { xs: 0.5, md: 2.4 },
  },
  searchBar: {
    maxWidth: 680,
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: 999,
      minHeight: 48,
    },
  },
  desktopNavWrap: {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: 1.5,
    flexGrow: 1,
    justifyContent: "center",
  },
  navLinksStack: (overrides = {}) => ({
    alignItems: { xs: "stretch", md: "center" },
    ...overrides,
  }),
  navLinkButton: (selected) => ({
    justifyContent: { xs: "flex-start", md: "center" },
    color: selected ? PUBLIC_UI.text : PUBLIC_UI.muted,
    fontWeight: selected ? 600 : 500,
    textTransform: "none",
    borderRadius: 2,
    px: 1.35,
    "&:hover": {
      backgroundColor: PUBLIC_UI.surfaceSoft,
    },
  }),
  actionsStack: {
    minWidth: { xs: "auto", md: 210 },
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signInButton: (isBooksRoute) => ({
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 500,
    px: { xs: 1.6, md: 2.2 },
    display: { xs: isBooksRoute ? "inline-flex" : "none", md: "inline-flex" },
  }),
  getStartedButton: {
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 500,
    px: { xs: 1.8, md: 2.4 },
    display: { xs: "none", md: "inline-flex" },
  },
  menuButton: {
    display: { xs: "inline-flex", md: "none" },
    color: PUBLIC_UI.primary,
  },
  drawerPaper: {
    width: "min(88vw, 320px)",
    bgcolor: PUBLIC_UI.surface,
    p: 2.5,
  },
  drawerStack: {
    height: "100%",
  },
  drawerHeader: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerTitle: {
    fontWeight: 600,
    color: PUBLIC_UI.text,
  },
  drawerFooter: {
    mt: "auto",
  },
  drawerLoginButton: {
    borderRadius: 3,
    textTransform: "none",
  },
  drawerSignupButton: {
    borderRadius: 3,
    textTransform: "none",
  },
};

// AppFooter
export const appFooterStyles = {
  root: {
    mt: 10,
    pt: { xs: 6, md: 8 },
    pb: { xs: 5, md: 5 },
    backgroundColor: "#000000",
    borderTop: "1px solid rgba(255, 255, 255, 0.16)",
    color: "rgba(255, 255, 255, 0.72)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 1.3fr) 1fr 1fr" },
    gap: { xs: 3, md: 4 },
    alignItems: "start",
  },
  introBlock: {
    maxWidth: 360,
  },
  brandTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#ffffff",
  },
  description: {
    mt: 1,
    lineHeight: 1.7,
  },
  socialList: {
    mt: 2.2,
    minHeight: 40,
    alignItems: "center",
  },
  socialButton: {
    width: 40,
    height: 40,
    color: "#ffffff",
    bgcolor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.25s ease",
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.16)",
      transform: "translateY(-2px)",
    },
  },
  sectionTitle: {
    fontWeight: 600,
    color: "#ffffff",
    mb: 1.2,
  },
  footerLink: {
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.72)",
    width: "fit-content",
    "&:hover": {
      color: "#ffffff",
    },
  },
  bottomBar: {
    mt: 5,
    pt: 3,
    borderTop: "1px solid rgba(255, 255, 255, 0.16)",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", md: "center" },
  },
};
