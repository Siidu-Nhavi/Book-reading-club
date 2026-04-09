import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "4rem 5%",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ margin: 0, color: "#c8873a", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Not found
        </p>
        <h1 style={{ margin: "0.6rem 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>
          This page does not exist.
        </h1>
        <p style={{ margin: "1rem 0 0", color: "#8c7b6b" }}>
          Return to the landing page or browse the catalog.
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/">Go Home</Link>
          <Link to="/books">Browse Books</Link>
        </div>
      </div>
    </main>
  );
}