import styles from './landingpage.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles['hero-text']}>
        <div className={styles['hero-eyebrow']}>✦ New Release</div>
        <h1>Discover Your Next<br /><em>Favorite</em> Book</h1>
        <p className={styles['hero-sub']}>Join millions of readers exploring thousands of books. From classics to contemporary, find your perfect read today.</p>
        <div className={styles['btn-group']}>
          <a href="/signup" className={styles['btn-primary']}>Start Reading Free →</a>
          <a href="#books" className={styles['btn-outline']}>Browse Books</a>
        </div>
      </div>
      <div className={styles['hero-visual']} aria-hidden="true">
        <div className={styles['book-card']}>
          <div className={styles['book-card-label']}>Fiction</div>
        </div>
        <div className={styles['book-card']}>
          <div className={styles['book-card-label']}>Mystery</div>
        </div>
        <div className={styles['book-card']}>
          <div className={styles['book-card-label']}>Romance</div>
        </div>
        <div className={styles['book-card']}>
          <div className={styles['book-card-label']}>Sci-Fi</div>
        </div>
        <div className={styles['book-card']}>
          <div className={styles['book-card-label']}>Biography</div>
        </div>
      </div>
    </section>
  );
}