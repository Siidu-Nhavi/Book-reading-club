import styles from "./landingpage.module.css";

export default function HeroSection() {
	return (
		<section className={styles.hero}>
			<div className={styles["hero-text"]}>
				<div className={`${styles["hero-eyebrow"]} ${styles["hero-stagger"]}`}>🎓 For Students & Readers</div>
				<h1 className={styles["hero-stagger"]}>
					Rent Books.
					<br />
					<em>Save More.</em> Read Freely.
				</h1>
				<p className={`${styles["hero-sub"]} ${styles["hero-stagger"]}`}>
					Discover affordable rentals from an academic-first library designed for campus readers,
					exam prep, and curious minds.
				</p>
				<div className={`${styles["btn-group"]} ${styles["hero-stagger"]}`}>
					<a href="#categories" className={styles["btn-primary"]}>
						Start Browsing →
					</a>
					<a href="#how-it-works" className={styles["btn-ghost"]}>
						See how it works ↓
					</a>
				</div>
				<div className={`${styles["hero-stats"]} ${styles["hero-stagger"]}`}>
					<div className={styles["hero-stat"]}>
						<span className={styles["hero-stat-value"]}>5000+</span>
						<span className={styles["hero-stat-label"]}>Books</span>
					</div>
					<div className={styles["hero-stat"]}>
						<span className={styles["hero-stat-value"]}>₹49</span>
						<span className={styles["hero-stat-label"]}>Starting</span>
					</div>
					<div className={styles["hero-stat"]}>
						<span className={styles["hero-stat-value"]}>2400+</span>
						<span className={styles["hero-stat-label"]}>Readers</span>
					</div>
				</div>
			</div>
			<div className={styles["hero-visual"]} aria-hidden="true">
				<div className={`${styles["book-card"]} ${styles["book-card-a"]}`}>
					<span className={styles["book-spine"]} />
					<span className={styles["book-vertical-title"]}>Operating Systems</span>
				</div>
				<div className={`${styles["book-card"]} ${styles["book-card-b"]}`}>
					<span className={styles["book-spine"]} />
					<span className={styles["book-vertical-title"]}>Data Structures</span>
				</div>
				<div className={`${styles["book-card"]} ${styles["book-card-c"]}`}>
					<span className={styles["book-spine"]} />
					<span className={styles["book-vertical-title"]}>Linear Algebra</span>
				</div>
				<div className={`${styles["floating-badge"]} ${styles["floating-badge-top"]}`}>
					Just Rented: DBMS
				</div>
				<div className={`${styles["floating-badge"]} ${styles["floating-badge-bottom"]}`}>
					⭐ 4.9 Rating
				</div>
			</div>
		</section>
	);
}