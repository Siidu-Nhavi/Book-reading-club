import styles from "./landingpage.module.css";

const testimonials = [
	{
		name: "Anika Rao",
		role: "B.Tech Student",
		initials: "AR",
		quote:
			"BookNest helped me rent semester books at a fraction of bookstore prices, and the process is incredibly smooth.",
	},
	{
		name: "Karan Sethi",
		role: "Exam Prep Reader",
		initials: "KS",
		quote:
			"I found all my core references in one place. The due-date reminders and availability labels are super useful.",
	},
	{
		name: "Maya Fernandes",
		role: "MBA Aspirant",
		initials: "MF",
		quote:
			"The categories feel curated for students and the platform saves me both money and time every month.",
	},
];

export default function TestimonialsSection() {
	return (
		<section className={styles.testimonialsSection} id="testimonials">
			<div className={styles["section-head-center"]}>
				<p className={styles["section-label"]}>Student Love</p>
				<h2 className={styles["section-title"]}>What Our Readers Say</h2>
			</div>

			<div className={`${styles["testimonials-grid"]} ${styles.reveal}`}>
				{testimonials.map((testimonial) => (
					<article key={testimonial.name} className={styles["testimonial-card"]}>
						<span className={styles["testimonial-quote-mark"]}>“</span>
						<div className={styles["testimonial-stars"]}>★★★★★</div>
						<p>{testimonial.quote}</p>
						<div className={styles["testimonial-author"]}>
							<span className={styles["testimonial-avatar"]}>{testimonial.initials}</span>
							<div>
								<strong>{testimonial.name}</strong>
								<span>{testimonial.role}</span>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}