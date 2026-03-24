import styles from './landingpage.module.css';

export default function Books() {
  return (
    <section className={styles.books} id="books">
      <div className={styles['section-label']}>✦ Popular Now</div>
      <div className={styles['section-title']}>Trending in<br />the Library</div>
      <p className={styles['section-sub']}>Handpicked by our community of avid readers.</p>
      <div className={`${styles['books-grid']} ${styles.reveal}`}>
        <div className={styles['book-item']}>
          <div className={`${styles['book-cover']} ${styles.bc1}`}>
            <div className={styles['book-cover-text']}>The Great Gatsby</div>
          </div>
          <div className={styles['book-title']}>The Great Gatsby</div>
          <div className={styles['book-author']}>F. Scott Fitzgerald</div>
          <div className={styles['book-stars']}>★★★★★</div>
        </div>
        <div className={styles['book-item']}>
          <div className={`${styles['book-cover']} ${styles.bc2}`}>
            <div className={styles['book-cover-text']}>To Kill a Mockingbird</div>
          </div>
          <div className={styles['book-title']}>To Kill a Mockingbird</div>
          <div className={styles['book-author']}>Harper Lee</div>
          <div className={styles['book-stars']}>★★★★★</div>
        </div>
        <div className={styles['book-item']}>
          <div className={`${styles['book-cover']} ${styles.bc3}`}>
            <div className={styles['book-cover-text']}>1984</div>
          </div>
          <div className={styles['book-title']}>1984</div>
          <div className={styles['book-author']}>George Orwell</div>
          <div className={styles['book-stars']}>★★★★★</div>
        </div>
        <div className={styles['book-item']}>
          <div className={`${styles['book-cover']} ${styles.bc4}`}>
            <div className={styles['book-cover-text']}>Pride and Prejudice</div>
          </div>
          <div className={styles['book-title']}>Pride and Prejudice</div>
          <div className={styles['book-author']}>Jane Austen</div>
          <div className={styles['book-stars']}>★★★★★</div>
        </div>
        <div className={styles['book-item']}>
          <div className={`${styles['book-cover']} ${styles.bc5}`}>
            <div className={styles['book-cover-text']}>The Catcher in the Rye</div>
          </div>
          <div className={styles['book-title']}>The Catcher in the Rye</div>
          <div className={styles['book-author']}>J.D. Salinger</div>
          <div className={styles['book-stars']}>★★★★★</div>
        </div>
        <div className={styles['book-item']}>
          <div className={`${styles['book-cover']} ${styles.bc6}`}>
            <div className={styles['book-cover-text']}>Harry Potter</div>
          </div>
          <div className={styles['book-title']}>Harry Potter and the Sorcerer's Stone</div>
          <div className={styles['book-author']}>J.K. Rowling</div>
          <div className={styles['book-stars']}>★★★★★</div>
        </div>
      </div>
    </section>
  );
}