import { Link } from "react-router-dom";
import styles from "./landingpage.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles["footer-brand"]}>
          <div className={styles.logo}>
            Book<span>Nest</span>
          </div>
          <p>
            Your gateway to endless stories and knowledge. Join our community of
            passionate readers today.
          </p>
        </div>
        <div className={styles["footer-col"]}>
          <h4>Product</h4>
          <ul>
            <li>
              <Link to="/features">Features</Link>
            </li>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <Link to="/mobile-app">Mobile App</Link>
            </li>
            <li>
              <Link to="/audio-books">Audio Books</Link>
            </li>
          </ul>
        </div>
        <div className={styles["footer-col"]}>
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
            </li>
            <li>
              <Link to="/press">Press</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className={styles["footer-col"]}>
          <h4>Support</h4>
          <ul>
            <li>
              <Link to="/help-center">Help Center</Link>
            </li>
            <li>
              <Link to="/community">Community</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </footer>
      <div className={styles["footer-bottom"]}>
        Copyright 2026 BookNest - Online Reading Book System. All rights
        reserved.
      </div>
    </>
  );
}
