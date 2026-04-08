import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

const validateSignup = ({ name, email, password }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

const inputErrorStyle = {
  border: "1px solid #c55353",
  background: "#fff7f6",
  boxShadow: "0 0 0 4px rgba(197, 83, 83, 0.08)",
};
const errorTextStyle = {
  color: "#b04a4a",
  fontSize: "12px",
  marginTop: "-2px",
  marginBottom: "4px",
  display: "block",
};

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, isReady } = useAuth();
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isReady && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isReady, navigate]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: validateSignup,
    onSubmit: async (values, helpers) => {
      setSubmitError("");

      try {
        await signup({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });

        navigate("/dashboard", { replace: true });
      } catch (error) {
        setSubmitError(error.message);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Start renting</span>
            <h2>Create your account</h2>
            <p>Join and explore thousands of books.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form" noValidate>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={formik.touched.name && formik.errors.name ? inputErrorStyle : undefined}
            />
            {formik.touched.name && formik.errors.name && (
              <small style={errorTextStyle}>{formik.errors.name}</small>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={formik.touched.email && formik.errors.email ? inputErrorStyle : undefined}
            />
            {formik.touched.email && formik.errors.email && (
              <small style={errorTextStyle}>{formik.errors.email}</small>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={formik.touched.password && formik.errors.password ? inputErrorStyle : undefined}
            />
            {formik.touched.password && formik.errors.password && (
              <small style={errorTextStyle}>{formik.errors.password}</small>
            )}

            {submitError && <small style={errorTextStyle}>{submitError}</small>}

            <button type="submit" className="btn primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        <aside className="auth-aside">
          <div className="auth-aside-inner">
            <h3>Your library awaits</h3>
            <p>Discover, rent, and enjoy books easily.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Signup;
