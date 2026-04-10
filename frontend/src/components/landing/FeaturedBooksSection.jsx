import { Link as RouterLink } from "react-router-dom";
import styles from "./landingpage.module.css";

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Price unavailable";
  }

  return `Rs ${numericPrice}/week`;
}

export default function FeaturedBooksSection({ books = [], isLoading = false }) {
  const visibleBooks = books.slice(0, 4);

  return (
    <section className={styles.featuredSection} id="featured-books">
      <div className={styles["section-head-center"]}>
        <p className={styles["section-label"]}>Fresh From The Shelf</p>
        <h2 className={styles["section-title"]}>New Arrivals You Can Rent Today</h2>
      </div>

      <div className={`${styles["featured-grid"]} ${styles.reveal}`}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <article
                key={`featured-skeleton-${index}`}
                className={`${styles["featured-card"]} ${styles["featured-card-skeleton"]}`}
                aria-hidden="true"
              />
            ))
          : visibleBooks.map((book) => (
              <article key={book._id} className={styles["featured-card"]}>
                <div className={styles["featured-image-wrap"]}>
                  <img
                    src={book.image}
                    alt={book.title}
                    className={styles["featured-image"]}
                    loading="lazy"
                  />
                </div>

                <div className={styles["featured-meta"]}>
                  <p className={styles["featured-category"]}>{book.category || "General"}</p>
                  <h3>{book.title}</h3>
                  <p className={styles["featured-author"]}>by {book.author}</p>
                  <div className={styles["featured-bottom"]}>
                    <span>{formatPrice(book.price)}</span>
                    <RouterLink to={`/books/${book._id}`}>View Book</RouterLink>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
