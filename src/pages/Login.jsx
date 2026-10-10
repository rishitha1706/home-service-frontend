
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";
import logo from "../assets/homeservice-logo.jpg";
import heroImage from "../assets/home-service-hero.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("role", data.role);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "SERVICE_PROVIDER") {
        navigate("/provider");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.status,
        err.response?.data
      );

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data?.message ||
                "Invalid email or password"
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <section className="login-showcase">
        <div className="showcase-brand">
          <img src={logo} alt="Home Service logo" />
          <span>Home Service</span>
        </div>

        <div className="showcase-content">
          <span className="showcase-label">WELCOME HOME</span>

          <h1>
            Your Home,
            <br />
            Our <span>Support.</span>
          </h1>

          <p className="showcase-description">
            Book trusted professionals for all your home service
            needs. Fast, reliable, and hassle-free.
          </p>

          <div className="showcase-features">
            <div className="showcase-feature">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Verified Professionals</h3>
                <p>Trusted experts for your home</p>
              </div>
            </div>

            <div className="showcase-feature">
              <div className="feature-icon">▦</div>
              <div>
                <h3>Easy Booking</h3>
                <p>Schedule at your convenience</p>
              </div>
            </div>

            <div className="showcase-feature">
              <div className="feature-icon">⌂</div>
              <div>
                <h3>Wide Range of Services</h3>
                <p>From cleaning to repairs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="showcase-image">
          <img
            src={heroImage}
            alt="Professional providing home repair services"
          />
        </div>

        <div className="showcase-dots">
          <span className="active" />
          <span />
          <span />
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-form-section">
        <div className="login-card">
          <div className="login-mobile-brand">
            <img src={logo} alt="Home Service logo" />
          </div>

          <div className="login-heading">
            <h2>Home Service</h2>
            <h3>Login</h3>
            <p>Login to manage your home services</p>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD WITH SHOW/HIDE ICON */}
            <div className="form-group">
              <label htmlFor="login-password">Password</label>

              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  title={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    /* Eye with a slash */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58a2 2 0 002.83 2.83" />
                      <path d="M9.88 5.09A10.8 10.8 0 0112 4.9c5 0 8.5 4.1 10 7.1a13.8 13.8 0 01-4 4.8" />
                      <path d="M6.6 6.6A14 14 0 002 12c1.5 3 5 7.1 10 7.1a10.8 10.8 0 003.1-.46" />
                    </svg>
                  ) : (
                    /* Normal eye */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <div className="login-divider" />

          <div className="login-signup">
            <span>Don't have an account?</span>

            <button
              type="button"
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>

          <p className="login-security-note">
            Your home deserves reliable care.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
