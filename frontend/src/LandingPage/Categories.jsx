import styles from './landingpage.module.css';

export default function Categories() {
  return (
    <section id="categories" style={{padding: '5rem 5%', background: 'var(--cream)'}}>
      <div className={styles['section-label']}>✦ Browse</div>
      <div className={styles['section-title']}>Explore by<br />Category</div>
      <p className={styles['section-sub']}>From timeless fiction to cutting-edge technology — there's something for every curious mind.</p>
      <div className={`${styles['categories-wrap']} ${styles.reveal}`}>
        <div className={styles['cat-pill']}><span>📚</span> Fiction</div>
        <div className={styles['cat-pill']}><span>🔍</span> Mystery</div>
        <div className={styles['cat-pill']}><span>💖</span> Romance</div>
        <div className={styles['cat-pill']}><span>🚀</span> Sci-Fi</div>
        <div className={styles['cat-pill']}><span>📜</span> History</div>
        <div className={styles['cat-pill']}><span>🧠</span> Self-Help</div>
        <div className={styles['cat-pill']}><span>👶</span> Children's</div>
        <div className={styles['cat-pill']}><span>💼</span> Business</div>
      </div>
    </section>
  );
}