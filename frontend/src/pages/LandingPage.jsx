import { useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";
import styles from "../components/landing/landingpage.module.css";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import HowItWorks from "../components/landing/HowItWorks";
import FeaturesSection from "../components/landing/FeaturesSection";
import CategoriesSection from "../components/landing/CategoriesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTABanner from "../components/landing/CTABanner";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  usePageTitle("BookNest - Rent Books, Save More");

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

  return (
    <div className={styles.landingPage}>
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTABanner />
      <LandingFooter />
    </div>
  );
}