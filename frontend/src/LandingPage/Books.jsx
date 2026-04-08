import { formatBookPrice, truncateText } from "../utils/books";
import styles from "./landingpage.module.css";

export default function Books({ books = [], isLoading = false, error = "" }) {
  const hasBooks = books.length > 0;

  return (
    <section className={styles.books} id="books">
      <div className={styles["section-label"]}>Popular Now</div>
      <div className={styles["section-title"]}>
        Trending in
        <br />
        the Library
      </div>
      <p className={styles["section-sub"]}>Fresh titles pulled from your live BookNest catalog.</p>
      <div className={`${styles["books-grid"]} ${styles.reveal}`}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`book-skeleton-${index}`}
                className={`${styles["book-item"]} ${styles["book-skeleton"]}`}
              >
                <div className={`${styles["book-cover"]} ${styles["book-cover-loading"]}`}>
                  <div className={styles["book-cover-text"]}>Loading book...</div>
                </div>
                <div className={styles["book-title"]}>Fetching latest title</div>
                <div className={styles["book-author"]}>Please wait</div>
                <div className={styles["book-stars"]}>Preparing catalog</div>
              </div>
            ))
          : null}

        {!isLoading && error ? (
          <div className={styles["books-status"]}>
            We could not load books right now. Please try again in a moment.
          </div>
        ) : null}

        {!isLoading && !error && !hasBooks ? (
          <div className={styles["books-status"]}>
            No books are available yet. Seed the catalog and they will appear here.
          </div>
        ) : null}

        {!isLoading && !error
          ? books.map((book) => (
              <div key={book._id} className={styles["book-item"]}>
                <div
                  className={`${styles["book-cover"]} ${styles["book-cover-live"]}`}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(26,18,8,0.08), rgba(26,18,8,0.55)), url(${book.image})`,
                  }}
                >
                  <div className={styles["book-category-chip"]}>{book.category}</div>
                  <div className={styles["book-cover-text"]}>{truncateText(book.title, 42)}</div>
                </div>
                <div className={styles["book-title"]}>{book.title}</div>
                <div className={styles["book-author"]}>by {book.author}</div>
                <div className={styles["book-stars"]}>{formatBookPrice(book.price)}</div>
              </div>
            ))
          : null}
      </div>
    </section>
  );
}
