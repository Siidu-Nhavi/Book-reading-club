import styles from './landingpage.module.css';

export default function CTA() {
  return (
    <section className={styles['cta-section']} id="cta">
      <h2>Join <em>thousands</em> of readers<br />and start your journey today.</h2>
      <p>Free to sign up. Thousands of books waiting. Your story starts here.</p>
      <a href="#" className={styles['btn-primary']}>Sign Up Free →</a>
      <a href="#books" className={styles['btn-outline']}>Browse First</a>
    </section>
  );
}