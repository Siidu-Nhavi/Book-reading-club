import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import styles from "./landingpage.module.css";

export default function Nav() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        Book<span>Nest</span>
      </Link>
      <ul className={styles["nav-links"]}>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#categories">Categories</a>
        </li>
        <li>
          <a href="#books">Books</a>
        </li>
        <li>
          <a href="#how">How It Works</a>
        </li>
        {isAuthenticated ? (
          <>
            <li>{user?.name}</li>
            <li>
              <button
                type="button"
                className={styles["nav-cta"]}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/signup" className={styles["nav-cta"]}>
              Sign Up
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
