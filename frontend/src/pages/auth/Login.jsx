import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import usePageTitle from "../../hooks/usePageTitle";
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

const Login = () => {
	usePageTitle("Login — BookNest");

	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const { login, isAuthenticated, isReady } = useAuth();
	const [submitError, setSubmitError] = useState("");
	const redirectTarget =
		searchParams.get("redirect") || location.state?.from?.pathname || "/dashboard";

	useEffect(() => {
		if (isReady && isAuthenticated) {
			navigate(redirectTarget, { replace: true });
		}
	}, [isAuthenticated, isReady, navigate, redirectTarget]);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validate: validateLogin,
		onSubmit: async (values, helpers) => {
			setSubmitError("");

			try {
				await login({
					email: values.email.trim().toLowerCase(),
					password: values.password,
				});

				navigate(redirectTarget, { replace: true });
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
						<span className="eyebrow">Welcome back</span>
						<h2>Login to BookNest</h2>
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
							style={formik.touched.password && formik.errors.password ? inputErrorStyle : undefined}
						/>
						{formik.touched.password && formik.errors.password && (
							<small style={errorTextStyle}>{formik.errors.password}</small>
						)}

						{submitError && <small style={errorTextStyle}>{submitError}</small>}

						<button type="submit" className="btn primary" disabled={formik.isSubmitting}>
							{formik.isSubmitting ? "Logging in..." : "Login"}
						</button>
					</form>

					<p className="auth-footer">
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</p>
				</div>

				<aside className="auth-aside">
					<div className="auth-aside-inner">
						<h3>BookNest</h3>
						<p>Rent books anytime, anywhere.</p>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default Login;