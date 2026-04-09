import { Link } from "react-router-dom";
import "./footerPages.css";

export default function FooterPageTemplate({ eyebrow, title, intro, sections, note }) {
  return (
    <main className="footer-page">
      <div className="footer-page__container">
        <section className="footer-page__hero">
          <p className="footer-page__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="footer-page__intro">{intro}</p>
          <div className="footer-page__actions">
            <Link className="footer-page__primary-link" to="/">
              Back to Home
            </Link>
            <Link className="footer-page__secondary-link" to="/support">
              Support Page
            </Link>
          </div>
        </section>

        <section className="footer-page__grid">
          {sections.map((section) => (
            <article className="footer-page__card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {note ? (
          <section className="footer-page__note">
            <h2>Need More Context?</h2>
            <p>{note}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}