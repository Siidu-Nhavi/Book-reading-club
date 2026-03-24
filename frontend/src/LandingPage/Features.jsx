import styles from './landingpage.module.css';

export default function Features() {
  return (
    <section className={styles.features} id="features">
      <div className={styles['section-label']}>✦ Why BookNest</div>
      <div className={styles['section-title']}>Everything a reader<br />could need</div>
      <p className={styles['section-sub']}>Thoughtfully crafted features that make your reading experience delightful, seamless, and personal.</p>
      <div className={`${styles['features-grid']} ${styles.reveal}`}>
        <div className={styles['feature-card']}>
          <div className={styles['feat-icon']}>📚</div>
          <div className={styles['feat-title']}>Vast Library</div>
          <div className={styles['feat-desc']}>Access thousands of books across all genres, from bestsellers to hidden gems.</div>
        </div>
        <div className={styles['feature-card']}>
          <div className={styles['feat-icon']}>📖</div>
          <div className={styles['feat-title']}>Seamless Reading</div>
          <div className={styles['feat-desc']}>Enjoy distraction-free reading with customizable themes and progress tracking.</div>
        </div>
        <div className={styles['feature-card']}>
          <div className={styles['feat-icon']}>👥</div>
          <div className={styles['feat-title']}>Community</div>
          <div className={styles['feat-desc']}>Connect with fellow readers, share reviews, and discover new books together.</div>
        </div>
        <div className={styles['feature-card']}>
          <div className={styles['feat-icon']}>📱</div>
          <div className={styles['feat-title']}>Cross-Platform</div>
          <div className={styles['feat-desc']}>Read on any device - desktop, tablet, or mobile. Your progress syncs everywhere.</div>
        </div>
        <div className={styles['feature-card']}>
          <div className={styles['feat-icon']}>🎧</div>
          <div className={styles['feat-title']}>Audio Books</div>
          <div className={styles['feat-desc']}>Listen to your favorite books with professional narration and adjustable speed.</div>
        </div>
        <div className={styles['feature-card']}>
          <div className={styles['feat-icon']}>💡</div>
          <div className={styles['feat-title']}>Personalized</div>
          <div className={styles['feat-desc']}>Get recommendations based on your reading history and preferences.</div>
        </div>
      </div>
    </section>
  );
}