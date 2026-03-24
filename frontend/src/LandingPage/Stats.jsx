import styles from './landingpage.module.css';

export default function Stats() {
  return (
    <div className={styles.stats}>
      <div className={styles['stat-item']}><span className={styles['stat-num']}>50K+</span><span className={styles['stat-label']}>Books Available</span></div>
      <div className={styles['stat-item']}><span className={styles['stat-num']}>120+</span><span className={styles['stat-label']}>Genres & Topics</span></div>
      <div className={styles['stat-item']}><span className={styles['stat-num']}>1M+</span><span className={styles['stat-label']}>Active Readers</span></div>
      <div className={styles['stat-item']}><span className={styles['stat-num']}>Free</span><span className={styles['stat-label']}>To Get Started</span></div>
    </div>
  );
}