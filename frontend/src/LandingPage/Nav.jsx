import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Avatar, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ProfileAvatarMenu from "../components/ProfileAvatarMenu";
import { BOOKNEST_COLORS } from "../utils/profile";
import styles from "./landingpage.module.css";

export default function Nav() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((current) => !current);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        Book<span>Nest</span>
      </Link>
      <IconButton
        type="button"
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={handleToggleMobileMenu}
        className={styles["nav-toggle"]}
        sx={{
          display: { xs: "inline-flex", md: "none" },
          color: BOOKNEST_COLORS.primaryBrown,
          border: `1px solid ${BOOKNEST_COLORS.border}`,
          backgroundColor: "rgba(255, 249, 242, 0.94)",
          backdropFilter: "blur(12px)",
        }}
      >
        {isMobileMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
      </IconButton>
      <ul
        className={`${styles["nav-links"]} ${isMobileMenuOpen ? styles["nav-links-open"] : ""}`}
      >
        <li>
          <a href="#features" onClick={handleCloseMobileMenu}>
            Features
          </a>
        </li>
        <li>
          <a href="#categories" onClick={handleCloseMobileMenu}>
            Categories
          </a>
        </li>
        <li>
          <a href="#books" onClick={handleCloseMobileMenu}>
            Books
          </a>
        </li>
        <li>
          <a href="#how" onClick={handleCloseMobileMenu}>
            How It Works
          </a>
        </li>
        {isAuthenticated ? (
          <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
            <ProfileAvatarMenu avatarSize={40} tooltipTitle="Open profile menu" />
          </Box>
        ) : (
          <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              type="button"
              aria-label="Open account"
              onClick={() => {
                handleCloseMobileMenu();
                navigate("/login");
              }}
              sx={{ p: 0.25, borderRadius: "999px" }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: BOOKNEST_COLORS.gold,
                  color: BOOKNEST_COLORS.text,
                  border: "2px solid #fff",
                  boxShadow: "0 10px 24px rgba(124, 79, 30, 0.16)",
                }}
              >
                <PersonRoundedIcon fontSize="small" />
              </Avatar>
            </IconButton>
          </Box>
        )}
      </ul>
    </nav>
  );
}
