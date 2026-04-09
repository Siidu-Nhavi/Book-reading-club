import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { primaryNavLinks } from "../../data/navLinks";
import ProfileAvatarMenu from "../ProfileAvatarMenu";
import styles from "./landingpage.module.css";

export default function LandingNavbar() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 80);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleToggleMobileMenu = () => {
		setIsMobileMenuOpen((current) => !current);
	};

	const handleCloseMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ""}`}>
			<Link to="/" className={styles.logo}>
				<span className={styles.logoMark} aria-hidden="true">
					📚
				</span>
				Book<span>Nest</span>
			</Link>
			<button
				type="button"
				aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
				onClick={handleToggleMobileMenu}
				className={styles["nav-toggle"]}
			>
				{isMobileMenuOpen ? "✕" : "☰"}
			</button>
			<ul
				className={`${styles["nav-links"]} ${isMobileMenuOpen ? styles["nav-links-open"] : ""}`}
			>
				{primaryNavLinks.map((item) => (
					<li key={item.label}>
						<Link to={item.to} onClick={handleCloseMobileMenu}>
							{item.label}
						</Link>
					</li>
				))}
				{isAuthenticated ? (
					<li className={styles["profile-item"]}>
						<ProfileAvatarMenu avatarSize={40} tooltipTitle="Open profile menu" />
					</li>
				) : (
					<li>
						<button
							type="button"
							className={styles["nav-cta"]}
							aria-label="Open sign in page"
							onClick={() => {
								handleCloseMobileMenu();
								navigate("/login");
							}}
						>
							Sign In
						</button>
					</li>
				)}
			</ul>
		</nav>
	);
}