import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", form);
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">

        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Welcome back</span>
            <h2>Login to BookRent</h2>
            <p>Continue your reading journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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

            <button className="btn primary">Login</button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>

        <aside className="auth-aside">
          <div className="auth-aside-inner">
            <h3>📚 BookRent</h3>
            <p>Rent books anytime, anywhere.</p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Login;