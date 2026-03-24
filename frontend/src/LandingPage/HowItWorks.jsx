import styles from './landingpage.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.how} id="how">
      <div className={styles['section-label']}>✦ Getting Started</div>
      <div className={styles['section-title']}>Up and reading<br />in 3 steps</div>
      <div className={`${styles.steps} ${styles.reveal}`}>
        <div className={styles.step}>
          <div className={styles['step-num']}>1</div>
          <h3>Sign Up Free</h3>
          <p>Create your account in seconds. No credit card required.</p>
        </div>
        <div className={styles.step}>
          <div className={styles['step-num']}>2</div>
          <h3>Choose Your Book</h3>
          <p>Browse our vast library and pick your first read.</p>
        </div>
        <div className={styles.step}>
          <div className={styles['step-num']}>3</div>
          <h3>Start Reading</h3>
          <p>Dive into your book with our seamless reading experience.</p>
        </div>
      </div>
    </section>
  );
}