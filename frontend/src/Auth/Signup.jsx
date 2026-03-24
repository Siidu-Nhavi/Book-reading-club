import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup:", form);
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">

        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Start renting</span>
            <h2>Create your account</h2>
            <p>Join and explore thousands of books.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <button className="btn primary">Sign Up</button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        <aside className="auth-aside">
          <div className="auth-aside-inner">
            <h3>📖 Your library awaits</h3>
            <p>Discover, rent, and enjoy books easily.</p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Signup;