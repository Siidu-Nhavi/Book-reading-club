import styles from "./landingpage.module.css";

const featureRows = [
	{
		icon: "📚",
		title: "Vast Catalog",
		description: "Access academic and non-academic titles across engineering, science, literature, and more.",
	},
	{
		icon: "🔐",
		title: "Secure Login",
		description: "Sign in safely and manage account preferences through a protected profile workspace.",
	},
	{
		icon: "🧾",
		title: "Rental History Tracking",
		description: "Review past rentals, due dates, and payment details in one organized timeline.",
	},
	{
		icon: "🟢",
		title: "Real-time Availability",
		description: "Check live status updates so you only request books that are currently available.",
	},
];

export default function FeaturesSection() {
	return (
		<section className={styles.featuresSection} id="features">
			<div className={`${styles["features-layout"]} ${styles.reveal}`}>
				<div>
					<p className={styles["section-label"]}>Platform Features</p>
					<h2 className={styles["section-title"]}>Everything You Need in One Platform</h2>
					<div className={styles["feature-list"]}>
						{featureRows.map((feature) => (
							<article key={feature.title} className={styles["feature-row"]}>
								<span className={styles["feature-icon-box"]}>{feature.icon}</span>
								<div>
									<h3>{feature.title}</h3>
									<p>{feature.description}</p>
								</div>
							</article>
						))}
					</div>
				</div>
				<aside className={styles["dashboard-card"]}>
					<p className={styles["dashboard-label"]}>📋 Your Active Rentals</p>
					<div className={styles["dashboard-rows"]}>
						<div className={styles["dashboard-row"]}>
							<div>
								<h4>Database Management Systems</h4>
								<p>Raghu Ramakrishnan • Due Apr 18</p>
							</div>
							<span className={`${styles.badge} ${styles["badge-rented"]}`}>Rented</span>
						</div>
						<div className={styles["dashboard-row"]}>
							<div>
								<h4>Signals & Systems</h4>
								<p>Alan V. Oppenheim • Due Apr 22</p>
							</div>
							<span className={`${styles.badge} ${styles["badge-rented"]}`}>Rented</span>
						</div>
						<div className={styles["dashboard-row"]}>
							<div>
								<h4>Clean Code</h4>
								<p>Robert C. Martin • Available now</p>
							</div>
							<span className={`${styles.badge} ${styles["badge-available"]}`}>Available</span>
						</div>
					</div>
					<div className={styles["dashboard-total"]}>
						<span>Total Saved vs. Buying</span>
						<strong>₹250</strong>
					</div>
				</aside>
			</div>
		</section>
	);
}