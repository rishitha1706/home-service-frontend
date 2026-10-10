
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CustomerDashboard.css";

import logo from "../assets/homeservice-logo.jpg";

import electrical from "../assets/electrical.jpg";
import fridge from "../assets/fridge.jpg";
import garden from "../assets/garden.jpg";
import geyser from "../assets/geyser.jpg";
import installation from "../assets/installation.jpg";
import painting from "../assets/paint.jpg";
import pest from "../assets/pest.jpg";
import plumbing from "../assets/plumbing.jpg";
import tv from "../assets/tv.jpg";
import washing from "../assets/washing.jpg";
import water from "../assets/water.jpg";
import acrepair from "../assets/ac-repair.jpg";
import bathroom from "../assets/bathroom.jpg";
import cleaning from "../assets/cleaning.jpg";
import carpentary from "../assets/carpentary.jpg";
import fanRepair from "../assets/fanRepair.jpg";


const serviceImages = [
  {
    keywords: ["ac repair", "air conditioner repair"],
    image: acrepair, // Replace with your AC repair image import if available
  },
  {
    keywords: ["ac installation", "air conditioner installation"],
    image: installation,
  },
  {
    keywords: ["plumbing", "plumber", "plumbing repair"],
    image: plumbing,
  },
  {
    keywords: ["electrician", "electrical", "wiring"],
    image: electrical,
  },
  {
    keywords: ["home cleaning", "house cleaning"],
    image: cleaning, // Replace with a dedicated cleaning image if available
  },
  {
    keywords: ["bathroom cleaning", "bathroom"],
    image: bathroom,
  },
  {
    keywords: ["painting", "painter"],
    image: painting,
  },
  {
    keywords: ["carpentry", "carpenter", "furniture repair"],
    image: carpentary, 
  },
  {
    keywords: ["pest control", "pest", "termite"],
    image: pest,
  },
  {
    keywords: ["washing machine", "laundry"],
    image: washing,
  },
  {
    keywords: ["refrigerator", "fridge"],
    image: fridge,
  },
  {
    keywords: ["geyser", "water heater"],
    image: geyser,
  },
  {
    keywords: ["water purifier", "ro purifier"],
    image: water,
  },
  {
    keywords: ["garden", "gardening"],
    image: garden,
  },
  {
    keywords: ["tv repair", "television repair"],
    image: tv,
  },
  {
  keywords: ["fan repair", "ceiling fan", "fan installation"],
  image: fanRepair,
}
];

function getServiceImage(service) {
  const text =
    `${service?.name || ""} ${service?.category || ""}`.toLowerCase();

  const matched = serviceImages.find((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  );

  return matched?.image || installation;
}

function getCustomerName() {
  const possibleNames = [
    sessionStorage.getItem("name"),
    sessionStorage.getItem("customerName"),
    localStorage.getItem("name"),
    localStorage.getItem("customerName"),
  ];

  for (const name of possibleNames) {
    if (name && name.trim()) return name.trim();
  }

  const possibleUsers = [
    sessionStorage.getItem("user"),
    localStorage.getItem("user"),
  ];

  for (const savedUser of possibleUsers) {
    if (!savedUser) continue;

    try {
      const user = JSON.parse(savedUser);
      const name = user.name || user.fullName || user.username;

      if (name) return name;
    } catch {
      // Ignore invalid JSON and check the next available value.
    }
  }

  return "Customer";
}

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [customerName] = useState(getCustomerName);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchServices() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/services");
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (active) setServices(list);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load services. Please check whether the backend is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchServices();

    return () => {
      active = false;
    };
  }, []);


const categories = useMemo(() => {
  const uniqueCategories = [
    ...new Set(
      services
        .map((service) => service.category)
        .filter(
          (category) =>
            category &&
            category.trim().toLowerCase() !== "ac"
        )
    ),
  ];

  return ["All", ...uniqueCategories];
}, [services]);

  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const name = (service.name || "").toLowerCase();
      const category = (service.category || "").toLowerCase();
      const description = (service.description || "").toLowerCase();
      const query = search.trim().toLowerCase();
      const price = Number(service.price) || 0;

      const matchesSearch =
        !query ||
        name.includes(query) ||
        category.includes(query) ||
        description.includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        service.category === selectedCategory;

      const matchesPrice = price <= maxPrice;
      const isAvailable = service.available !== false;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        isAvailable
      );
    });

    if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    return result;
  }, [services, search, selectedCategory, maxPrice, sortBy]);

  function resetFilters() {
    setSearch("");
    setSelectedCategory("All");
    setMaxPrice(10000);
    setSortBy("default");
  }

  function handleBookService(service) {
    if (!service?.id) {
      window.alert("This service does not have a valid ID.");
      return;
    }

    navigate(`/customer/book-service/${service.id}`);
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("customerName");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");

    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("customerName");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div className="customer-dashboard">
      {/* HEADER */}
      <header className="customer-topbar">
        <div className="customer-brand">
          <img
            src={logo}
            alt="Home Service Logo"
            className="customer-logo"
          />

          <div className="customer-brand-text">
            <h2>Home Service</h2>
            <p>
              Welcome <span className="logged-in-name">{customerName}</span>
            </p>
            <h3>Customer Dashboard</h3>
          </div>
        </div>

        <nav className="customer-nav">
          <button
            className="nav-link active"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Home
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/customer/bookings")}
          >
            My Bookings
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="customer-main">
        {/* HERO WITH IMAGE ON THE RIGHT */}
        <section className="customer-hero">
          <div className="hero-content">
            <span className="hero-label">CUSTOMER SERVICES</span>

            <h1>
              Find the right help
              <br />
              for your <span>home.</span>
            </h1>

            <p>
              Discover home services, compare prices, and book professionals
              for your everyday needs—all in one place.
            </p>

            <button
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("services-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Services <span aria-hidden="true">→</span>
            </button>

            <div className="hero-benefits">
              <span>Trusted professionals</span>
              <span>Clear pricing</span>
              <span>Easy booking</span>
            </div>
          </div>

          <div className="hero-illustration">
            <img
              src={installation}
              alt="Professional home installation service"
            />

            <div className="hero-floating-card">
              <span className="floating-icon">✓</span>

              <div>
                <strong>Home care made easy</strong>
                <p>Find the right service for your home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="service-section" id="services-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">OUR SERVICES</span>
              <h2>What does your home need?</h2>
              <p>
                Browse available services and choose what works for you.
              </p>
            </div>

            <div className="service-count">
              {filteredServices.length} services found
            </div>
          </div>

          {/* SEARCH AND SORT */}
          <div className="service-toolbar">
            <div className="service-search">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search plumbing, electrical, cleaning..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search services"
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <label className="sort-control">
              <span>Sort by</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="default">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          <div className="service-layout">
            {/* FILTER SIDEBAR */}
            <aside className="service-filters">
              <div className="filter-heading">
                <h3>Filters</h3>
                <button onClick={resetFilters}>Reset all</button>
              </div>

              <div className="filter-group">
                <h4>Categories</h4>

                <div className="category-options">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`category-option ${
                        selectedCategory === category ? "selected" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{category}</span>

                      <span className="category-radio">
                        {selectedCategory === category ? "●" : "○"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group price-filter">
                <div className="price-heading">
                  <h4>Maximum price</h4>
                  <strong>
                    ₹{maxPrice.toLocaleString("en-IN")}
                  </strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(Number(event.target.value))
                  }
                  aria-label="Maximum service price"
                />

                <div className="price-range-labels">
                  <span>₹0</span>
                  <span>₹10,000</span>
                </div>
              </div>

              <div className="filter-note">
                <span className="filter-note-icon">i</span>
                <p>
                  Select a service to see its details and continue with
                  booking.
                </p>
              </div>
            </aside>

            {/* SERVICE RESULTS */}
            <div className="services-results">
              {loading ? (
                <div className="dashboard-message">
                  <div className="loading-spinner" />
                  <h3>Loading services</h3>
                  <p>Please wait while we fetch available services.</p>
                </div>
              ) : error ? (
                <div className="dashboard-message">
                  <h3>Unable to load services</h3>
                  <p>{error}</p>

                  <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="dashboard-message">
                  <div className="empty-service-icon">⌕</div>
                  <h3>No services found</h3>
                  <p>
                    Try changing your search or filters to find more services.
                  </p>

                  <button className="retry-button" onClick={resetFilters}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="services-grid">
                  {filteredServices.map((service) => (
                    <article className="service-card" key={service.id}>
                      <div className="service-image-wrap">
                        <img
                          className="service-image"
                          src={getServiceImage(service)}
                          alt={service.name || "Home service"}
                          loading="lazy"
                        />

                        <span className="service-category-badge">
                          {service.category || "Home Service"}
                        </span>
                      </div>

                      <div className="service-card-content">
                        <h3>{service.name || "Home Service"}</h3>

                        <p className="service-description">
                          {service.description ||
                            "Professional home service to help with your everyday needs."}
                        </p>

                        <div className="service-card-bottom">
                          <div className="service-price">
                            <span>Service price</span>
                            <strong>
                              ₹
                              {Number(service.price || 0).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </div>

                          <button
                            className="book-service-button"
                            onClick={() => handleBookService(service)}
                          >
                            Book Now<span aria-hidden="true">→</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

       
{/* ABOUT US AND CONTACT US */}
<section className="customer-info-section">
  <div className="customer-info-card" id="about-us">
    <div className="customer-info-icon">⌂</div>
    <h2>About Us</h2>
    <p>
      Home Service makes it easier to find and book reliable professionals
      for your everyday household needs. From plumbing and electrical
      repairs to cleaning and appliance services, we help you care for
      your home conveniently.
    </p>
    <button
      onClick={() => navigate("/customer/about")}
      className="customer-info-button"
    >
      Learn More →
    </button>
  </div>

  <div className="customer-info-card" id="contact-us">
    <div className="customer-info-icon">✉</div>
    <h2>Contact Us</h2>
    <p>
      Have questions about a service or booking? Our team is here to help
      you with your Home Service experience.
    </p>
    <button
      onClick={() => navigate("/customer/contact")}
      className="customer-info-button"
    >
      Get in Touch →
    </button>
  </div>
</section>

        {/* SUPPORT BANNER */}
        <section className="customer-help-banner">
          <div>
            <span>HOME SERVICE SUPPORT</span>
            <h2>Make home care easier.</h2>
            <p>
              Find a service that suits your needs and get started today.
            </p>
          </div>

          <button
            onClick={() =>
              document
                .getElementById("services-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse Services →
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="customer-footer">
        <div className="footer-brand">
          <img src={logo} alt="" className="footer-logo" />
          <strong>Home Service</strong>
        </div>

        <p>Making everyday home care simpler.</p>

        <span>© {new Date().getFullYear()} Home Service</span>
      </footer>
    </div>
  );
}
