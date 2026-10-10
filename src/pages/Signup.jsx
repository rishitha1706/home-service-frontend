
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";
import "./Signup.css";
import logo from "../assets/homeservice-logo.jpg";
import heroImage from "../assets/home-service-hero.png";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
    specialization: "",
  });

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      try {
        const response = await api.get("/services");

        if (!cancelled) {
          setServices(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (err) {
        console.error("Error loading services:", err);

        if (!cancelled) {
          setError("Unable to load available services.");
        }
      } finally {
        if (!cancelled) {
          setLoadingServices(false);
        }
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;

    setFormData((previous) => ({
      ...previous,
      role,
      specialization:
        role === "CUSTOMER" ? "" : previous.specialization,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (
      formData.role === "SERVICE_PROVIDER" &&
      !formData.specialization
    ) {
      setError("Please select your service type.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        specialization:
          formData.role === "SERVICE_PROVIDER"
            ? formData.specialization
            : null,
      };

      const response = await api.post("/users", payload);

      console.log("Signup successful:", response.data);

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(
        "Signup error:",
        err.response?.status,
        err.response?.data
      );

      const responseData = err.response?.data;

      if (err.response?.status === 403) {
        setError(
          "Registration forbidden. Check your backend security configuration."
        );
      } else if (err.response?.status === 409) {
        setError(
          responseData?.message ||
            "An account with these details already exists."
        );
      } else {
        setError(
          (typeof responseData === "string" && responseData) ||
            responseData?.message ||
            responseData?.error ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page signup-page">
      <section className="login-showcase">
        <div className="showcase-brand">
          <img src={logo} alt="Home Service logo" />
          <span>Home Service</span>
        </div>

        <div className="showcase-content">
          <span className="showcase-label">JOIN OUR COMMUNITY</span>

          <h1>
            Your Home,
            <br />
            Our <span>Support.</span>
          </h1>

          <p className="showcase-description">
            Create your account and connect with trusted
            professionals for all your home service needs.
            Fast, reliable, and hassle-free.
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
            alt="Home service professional"
          />
        </div>

        <div className="showcase-dots">
          <span className="active" />
          <span />
          <span />
        </div>
      </section>

      <section className="login-form-section signup-form-section">
        <div className="login-card signup-card">
          <div className="login-mobile-brand">
            <img src={logo} alt="Home Service logo" />
          </div>

          <div className="login-heading">
            <h2>Home Service</h2>
            <h3>Create Account</h3>
            <p>Register to get started with Home Service</p>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="signup-success-message" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-phone">Phone Number</label>
              <input
                id="signup-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(event) => {
                  const phone = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setFormData((previous) => ({
                    ...previous,
                    phone,
                  }));
                }}
                placeholder="Enter your 10-digit phone number"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create your password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-role">Register As</label>
              <select
                id="signup-role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                required
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SERVICE_PROVIDER">
                  Service Provider
                </option>
              </select>
            </div>

            {formData.role === "SERVICE_PROVIDER" && (
              <div className="form-group">
                <label htmlFor="signup-specialization">
                  Service Type
                </label>

                <select
                  id="signup-specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={
                    loadingServices || services.length === 0
                  }
                  required
                >
                  <option value="">
                    {loadingServices
                      ? "Loading services..."
                      : services.length === 0
                        ? "No services available"
                        : "Select your service"}
                  </option>

                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.name}
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={
                loading ||
                (formData.role === "SERVICE_PROVIDER" &&
                  (loadingServices ||
                    services.length === 0 ||
                    !formData.specialization))
              }
            >
              {loading ? "Creating Account..." : "Sign Up →"}
            </button>
          </form>

          <div className="login-divider" />

          <div className="login-signup">
            <span>Already have an account?</span>
            <button
              type="button"
              className="signup-link"
              onClick={() => navigate("/login")}
            >
              Login
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

export default Signup;
