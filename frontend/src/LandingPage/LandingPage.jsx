
import { useEffect } from 'react';
import styles from './landingpage.module.css';
import Nav from './Nav';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import Categories from './Categories';
import Books from './Books';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll(`.${styles.reveal}`);
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  return (
    <div className={styles['landing-page']}>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Categories />
      <Books />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}