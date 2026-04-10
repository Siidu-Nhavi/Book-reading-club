import { Link as RouterLink } from "react-router-dom";
import { categoryLinks } from "../../data/navLinks";
import styles from "./landingpage.module.css";

export default function CategoriesSection({ categories = categoryLinks, isLoading = false }) {
	const visibleCategories = categories.slice(0, 7);

	return (
		<section className={styles.categoriesSection} id="categories">
			<div className={styles["section-head-center"]}>
				<p className={styles["section-label"]}>Browse by Category</p>
				<h2 className={styles["section-title"]}>Find Your Next Read</h2>
			</div>
			<div className={`${styles["category-grid"]} ${styles.reveal}`}>
				{isLoading
					? Array.from({ length: 5 }).map((_, index) => (
							<article
								key={`category-skeleton-${index}`}
								className={`${styles["category-card"]} ${styles["category-card-skeleton"]}`}
								aria-hidden="true"
							/>
						))
					: visibleCategories.map((category) => (
							<article key={category.label} className={styles["category-card"]}>
								<span className={styles["category-emoji"]}>{category.icon}</span>
								<h3>{category.label}</h3>
								<RouterLink to={category.to} className={styles["category-link"]}>
									Explore
								</RouterLink>
							</article>
						))}
			</div>
		</section>
	);
}