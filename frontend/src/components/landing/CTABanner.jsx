import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import styles from "./landingpage.module.css";

export default function CTABanner() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	return (
		<section className={styles["cta-shell"]} id="cta">
			<div className={`${styles["cta-banner"]} ${styles.reveal}`}>
				<h2>
					Ready to Start Reading <em>Without Overspending?</em>
				</h2>
				<p>
					Build your semester reading list, rent smarter, and keep your costs low without
					sacrificing access.
				</p>
				<button
					type="button"
					className={styles["btn-primary"]}
					onClick={() => {
						if (!isAuthenticated) {
							navigate("/signup");
						}
					}}
				>
					Create Free Account →
				</button>
			</div>
		</section>
	);
}
