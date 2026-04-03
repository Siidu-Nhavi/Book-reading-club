import { useFormik } from "formik";
import { Link } from "react-router-dom";
import "./Auth.css";

const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

const inputErrorStyle = { border: "1px solid #ef4444" };
const errorTextStyle = {
  color: "#f87171",
  fontSize: "12px",
  marginTop: "-4px",
  marginBottom: "6px",
};

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit: (values) => {
      console.log("Login:", {
        ...values,
        email: values.email.trim(),
      });
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Welcome back</span>
            <h2>Login to BookRent</h2>
            <p>Continue your reading journey.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form" noValidate>
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
              style={
                formik.touched.password && formik.errors.password ? inputErrorStyle : undefined
              }
            />
            {formik.touched.password && formik.errors.password && (
              <small style={errorTextStyle}>{formik.errors.password}</small>
            )}

            <button type="submit" className="btn primary">
              Login
            </button>
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
