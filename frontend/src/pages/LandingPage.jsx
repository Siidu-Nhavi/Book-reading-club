import { useEffect, useMemo, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import styles from "../components/landing/landingpage.module.css";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import HowItWorks from "../components/landing/HowItWorks";
import FeaturesSection from "../components/landing/FeaturesSection";
import CategoriesSection from "../components/landing/CategoriesSection";
import FeaturedBooksSection from "../components/landing/FeaturedBooksSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTABanner from "../components/landing/CTABanner";
import AppFooter from "../components/shared/AppFooter";
import { categoryLinks } from "../data/navLinks";
import { booksApi } from "../lib/api";

const CATEGORY_ICON_MAP = Object.fromEntries(
  categoryLinks.map((category) => [category.label.toLowerCase(), category.icon]),
);

function toCategoryFilter(categoryName) {
  return categoryName.trim().toLowerCase().replace(/\s+/g, "-");
}

function mapCategory(categoryName) {
  const trimmedName = categoryName.trim();

  return {
    label: trimmedName,
    to: `/books?category=${encodeURIComponent(toCategoryFilter(trimmedName))}`,
    icon: CATEGORY_ICON_MAP[trimmedName.toLowerCase()] || "📚",
  };
}

export default function LandingPage() {
  usePageTitle("BookNest - Rent Books, Save More");
  const [categories, setCategories] = useState(categoryLinks.slice(0, 7));
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isHomeDataLoading, setIsHomeDataLoading] = useState(true);

  const fallbackCategories = useMemo(() => categoryLinks.slice(0, 7), []);

  useEffect(() => {
    const reveals = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.12 },
    );

    reveals.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLandingData = async () => {
      setIsHomeDataLoading(true);

      try {
        const [categoriesResponse, featuredResponse] = await Promise.all([
          booksApi.categories(),
          booksApi.list({ limit: 4, sortBy: "newest", availability: "available" }),
        ]);

        if (!isMounted) {
          return;
        }

        const apiCategories = (categoriesResponse.categories || []).slice(0, 7).map(mapCategory);

        setCategories(apiCategories.length > 0 ? apiCategories : fallbackCategories);
        setFeaturedBooks(featuredResponse.books || []);
      } catch {
        if (!isMounted) {
          return;
        }

        setCategories(fallbackCategories);
        setFeaturedBooks([]);
      } finally {
        if (isMounted) {
          setIsHomeDataLoading(false);
        }
      }
    };

    loadLandingData();

    return () => {
      isMounted = false;
    };
  }, [fallbackCategories]);

  return (
    <div className={styles.landingPage}>
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <FeaturedBooksSection books={featuredBooks} isLoading={isHomeDataLoading} />
      <CategoriesSection categories={categories} isLoading={isHomeDataLoading} />
      <TestimonialsSection />
      <CTABanner />
      <AppFooter />
    </div>
  );
}