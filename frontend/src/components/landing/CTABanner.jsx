import styles from "./landingpage.module.css";

export default function CTABanner() {
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
				<a href="/signup" className={styles["btn-primary"]}>
					Create Free Account →
				</a>
			</div>
		</section>
	);
}