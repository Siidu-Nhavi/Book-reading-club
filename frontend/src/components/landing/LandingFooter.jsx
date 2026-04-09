import { Link as RouterLink } from "react-router-dom";
import { footerLinks } from "../../data/navLinks";
import styles from "./landingpage.module.css";

const footerSectionsOrder = ["Product", "Company", "Support", "Legal"];

export default function LandingFooter() {
	return (
		<footer className={styles.footerBar}>
			<div className={styles["footer-top"]}>
				<div className={styles["footer-brand"]}>
					<span aria-hidden="true">📚</span>
					Book<span>Nest</span>
				</div>
				<div className={styles["footer-links-grid"]}>
					{footerSectionsOrder.map((sectionTitle) => (
						<div key={sectionTitle} className={styles["footer-link-column"]}>
							<h4>{sectionTitle}</h4>
							<ul>
								{(footerLinks[sectionTitle] || []).map((link) => (
									<li key={link.label}>
										<RouterLink to={link.to}>{link.label}</RouterLink>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			<p className={styles["footer-copy"]}>
				Copyright 2026 BookNest • Online Reading Book System
			</p>
		</footer>
	);
}