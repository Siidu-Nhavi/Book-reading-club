import { useEffect, useState } from "react";
import { booksApi } from "../lib/api";
import styles from "./landingpage.module.css";
import Nav from "./Nav";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import Categories from "./Categories";
import Books from "./Books";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    const reveals = document.querySelectorAll(`.${styles.reveal}`);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setIsCatalogLoading(true);
      setCatalogError("");

      try {
        const [booksData, categoriesData] = await Promise.all([
          booksApi.list({ limit: 6, sortBy: "latest" }),
          booksApi.categories(),
        ]);

        if (!isMounted) {
          return;
        }

        setBooks(booksData.books || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCatalogError(error.message || "Unable to load catalog");
      } finally {
        if (isMounted) {
          setIsCatalogLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles["landing-page"]}>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Categories categories={categories} isLoading={isCatalogLoading} />
      <Books books={books} isLoading={isCatalogLoading} error={catalogError} />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
