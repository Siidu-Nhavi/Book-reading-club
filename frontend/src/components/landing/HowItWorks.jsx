import styles from "./landingpage.module.css";

const steps = [
	{
		number: "1",
		icon: "📝",
		title: "Register",
		description: "Create your account in under a minute and unlock the student rental dashboard.",
	},
	{
		number: "2",
		icon: "🔍",
		title: "Search",
		description: "Filter by course, author, and availability to quickly find your next book.",
	},
	{
		number: "3",
		icon: "💳",
		title: "Rent & Pay",
		description: "Reserve instantly with secure checkout and transparent rental plans.",
	},
	{
		number: "4",
		icon: "📦",
		title: "Return",
		description: "Use reminders and due-date tracking so returns stay simple and stress free.",
	},
];

export default function HowItWorks() {
	return (
		<section className={styles.howSection} id="how-it-works">
			<div className={styles["section-head-center"]}>
				<p className={styles["section-label"]}>Simple Process</p>
				<h2 className={styles["section-title"]}>Rent a Book in 4 Easy Steps</h2>
			</div>
			<div className={`${styles["how-grid"]} ${styles.reveal}`}>
				{steps.map((step) => (
					<article key={step.title} className={styles["how-card"]}>
						<span className={styles["how-step-number"]}>{step.number}</span>
						<span className={styles["how-step-icon"]}>{step.icon}</span>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}