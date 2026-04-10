export const PUBLIC_UI = {
  pageTop: "#7868F4",
  pageTopDark: "#6757E8",
  pageBackground: "#F4F5FB",
  surface: "#FFFFFF",
  surfaceSoft: "#F7F6FF",
  surfaceMuted: "#EEF1FF",
  primary: "#6C5CE7",
  primaryDark: "#5948D8",
  primarySoft: "#ECE9FF",
  accent: "#FF9E57",
  accentSoft: "#FFF0E4",
  text: "#1D2040",
  muted: "#7C81A3",
  border: "rgba(103, 92, 231, 0.12)",
  borderStrong: "rgba(103, 92, 231, 0.2)",
  success: "#3FAF74",
  danger: "#E05A76",
  shadow: "0 12px 34px rgba(73, 62, 166, 0.12)",
  hoverShadow: "0 18px 40px rgba(73, 62, 166, 0.18)",
  heroShadow: "0 24px 60px rgba(62, 54, 141, 0.18)",
  cardRadius: 5,
  controlRadius: 3,
  sectionRadius: 6,
  cardPadding: 2.25,
  bookCardWidth: 252,
};

export const PUBLIC_SURFACE_SX = {
  borderRadius: PUBLIC_UI.sectionRadius,
  border: `1px solid ${PUBLIC_UI.border}`,
  backgroundColor: PUBLIC_UI.surface,
  boxShadow: PUBLIC_UI.shadow,
};

export const PUBLIC_CARD_SX = {
  borderRadius: PUBLIC_UI.cardRadius,
  border: `1px solid ${PUBLIC_UI.border}`,
  backgroundColor: PUBLIC_UI.surface,
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: PUBLIC_UI.hoverShadow,
  },
};

export const PUBLIC_BUTTON_PRIMARY_SX = {
  bgcolor: PUBLIC_UI.primary,
  color: "#fff",
  borderRadius: PUBLIC_UI.controlRadius,
  textTransform: "none",
  fontWeight: 500,
  boxShadow: "0 10px 24px rgba(108, 92, 231, 0.22)",
  cursor: "pointer",
  transition:
    "transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, color 0.3s ease-in-out",
  "&:hover": {
    bgcolor: PUBLIC_UI.primaryDark,
  },
  "&:active": {
    transform: "scale(0.98)",
  },
};

export const PUBLIC_BUTTON_GHOST_SX = {
  color: PUBLIC_UI.primary,
  borderColor: PUBLIC_UI.borderStrong,
  backgroundColor: PUBLIC_UI.surface,
  borderRadius: PUBLIC_UI.controlRadius,
  textTransform: "none",
  fontWeight: 500,
  cursor: "pointer",
  transition:
    "transform 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    borderColor: PUBLIC_UI.primary,
    backgroundColor: PUBLIC_UI.surfaceSoft,
  },
  "&:active": {
    transform: "scale(0.98)",
  },
};

export function getPublicHeroBackground() {
  return `linear-gradient(180deg, ${PUBLIC_UI.pageTop} 0%, ${PUBLIC_UI.pageTopDark} 100%)`;
}
