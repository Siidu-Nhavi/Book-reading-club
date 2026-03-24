import styles from './landingpage.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Book<span>Nest</span></div>
      <ul className={styles['nav-links']}>
        <li><a href="#features">Features</a></li>
        <li><a href="#categories">Categories</a></li>
        <li><a href="#books">Books</a></li>
        <li><a href="#how">How It Works</a></li>
        <li><a href="#" className={styles['nav-cta']}>Sign Up</a></li>
      </ul>
    </nav>
  );
}