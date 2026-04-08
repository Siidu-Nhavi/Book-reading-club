import styles from "./landingpage.module.css";

const fallbackCategories = [
  "Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "History",
  "Self-Help",
  "Children's",
  "Business",
];

export default function Categories({ categories = [], isLoading = false }) {
  const items = categories.length ? categories : fallbackCategories;

  return (
    <section id="categories" style={{ padding: "5rem 5%", background: "var(--cream)" }}>
      <div className={styles["section-label"]}>Browse</div>
      <div className={styles["section-title"]}>
        Explore by
        <br />
        Category
      </div>
      <p className={styles["section-sub"]}>
        Browse the live BookNest catalog by category and discover something for every mood.
      </p>
      <div className={`${styles["categories-wrap"]} ${styles.reveal}`}>
        {items.slice(0, 8).map((category) => (
          <div key={category} className={styles["cat-pill"]}>
            <span>{isLoading ? "..." : "#"}</span>
            {category}
          </div>
        ))}
      </div>
    </section>
  );
}
