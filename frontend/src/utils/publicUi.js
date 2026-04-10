export const PUBLIC_UI = {
  pageTop: "#f5f3ef",
  pageTopDark: "#efede9",
  pageBackground: "#fafaf9",
  surface: "#ffffff",
  surfaceSoft: "#f8f7f4",
  surfaceMuted: "#f5f3ef",
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primarySoft: "#eff6ff",
  accent: "#2563eb",
  accentSoft: "#eff6ff",
  text: "#1a1917",
  muted: "#6b6963",
  border: "#e8e6e1",
  borderStrong: "#d4d1cb",
  success: "#16a34a",
  danger: "#dc2626",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  hoverShadow: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
  heroShadow: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
  cardRadius: 2,
  controlRadius: 2,
  sectionRadius: 3,
  cardPadding: 2.25,
  bookCardWidth: 252,
};

export const PUBLIC_SURFACE_SX = {
  borderRadius: PUBLIC_UI.sectionRadius,
  border: `1px solid ${PUBLIC_UI.border}`,
  backgroundColor: PUBLIC_UI.surface,
  boxShadow: "none",
};

export const PUBLIC_CARD_SX = {
  borderRadius: PUBLIC_UI.cardRadius,
  border: `1px solid ${PUBLIC_UI.border}`,
  backgroundColor: PUBLIC_UI.surface,
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: PUBLIC_UI.borderStrong,
  },
};

export const PUBLIC_BUTTON_PRIMARY_SX = {
  bgcolor: PUBLIC_UI.primary,
  color: "#fff",
  borderRadius: PUBLIC_UI.controlRadius,
  textTransform: "none",
  fontWeight: 500,
  boxShadow: "none",
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
