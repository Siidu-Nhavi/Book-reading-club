import styles from './landingpage.module.css';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles['footer-brand']}>
          <div className={styles.logo}>Book<span>Nest</span></div>
          <p>Your gateway to endless stories and knowledge. Join our community of passionate readers today.</p>
        </div>
        <div className={styles['footer-col']}>
          <h4>Product</h4>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Mobile App</a></li>
            <li><a href="#">Audio Books</a></li>
          </ul>
        </div>
        <div className={styles['footer-col']}>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className={styles['footer-col']}>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </footer>
      <div className={styles['footer-bottom']}>© 2026 BookNest – Online Reading Book System. All rights reserved.</div>
    </>
  );
}