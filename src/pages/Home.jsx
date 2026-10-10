
import { useNavigate } from "react-router-dom";

import logo from "../assets/homeservice-logo.jpg";
import homeBg from "../assets/home-bg.jpg";

import plumbing from "../assets/plumbing.jpg";
import electrical from "../assets/electrical.jpg";
import cleaning from "../assets/cleaning.jpg";
import painting from "../assets/paint.jpg";
import carpentry from "../assets/carpentary.jpg";
import acRepair from "../assets/ac-repair.jpg";
import pestControl from "../assets/pest.jpg";
import washingMachine from "../assets/washing.jpg";
import refrigerator from "../assets/fridge.jpg";
import waterPurifier from "../assets/water.jpg";
import gardening from "../assets/garden.jpg";
import installation from "../assets/installation.jpg";

function Home() {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const section = document.getElementById(id);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const services = [
        {
            number: "01",
            name: "Plumbing",
            image: plumbing,
            description:
                "Pipe repairs, leakage fixing, taps and plumbing services.",
        },
        {
            number: "02",
            name: "Electrical",
            image: electrical,
            description:
                "Wiring, switches, lights, fans and electrical repairs.",
        },
        {
            number: "03",
            name: "Home Cleaning",
            image: cleaning,
            description:
                "Home, kitchen, bathroom and deep cleaning services.",
        },
        {
            number: "04",
            name: "Painting",
            image: painting,
            description:
                "Interior and exterior painting services.",
        },
        {
            number: "05",
            name: "Carpentry",
            image: carpentry,
            description:
                "Furniture repair, doors, cupboards and woodwork.",
        },
        
        {
            number: "06",
            name: "AC Repair",
            image: acRepair,
            description:
                "AC servicing, installation and repairs.",
        },
        {
            number: "07",
            name: "Pest Control",
            image: pestControl,
            description:
                "Professional pest control solutions for your home.",
        },
        {
            number: "08",
            name: "Washing Machine",
            image: washingMachine,
            description:
                "Installation, servicing and washing machine repairs.",
        },
        {
            number: "09",
            name: "Refrigerator",
            image: refrigerator,
            description:
                "Refrigerator repair and cooling solutions.",
        },
        {
            number: "10",
            name: "Water Purifier",
            image: waterPurifier,
            description:
                "RO installation, filter replacement and maintenance.",
        },
        {
            number: "11",
            name: "Gardening",
            image: gardening,
            description:
                "Garden maintenance, trimming and planting.",
        },
         {
            number: "12",
            name: "ac-installation",
            image: installation,
            description:
                "AC installation and servicing.",
        },
    ];

    return (
        <div className="home-page">
            {/* HEADER */}
            <header className="home-header">
                <div
                    className="home-brand"
                    onClick={() => scrollToSection("home-section")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            scrollToSection("home-section");
                        }
                    }}
                >
                    <div className="home-logo">
                        <img src={logo} alt="Home Service" />
                    </div>

                    <div className="home-brand-text">
                        <h1>Home Service</h1>
                        <p>Professional Services at Your Doorstep</p>
                    </div>
                </div>

                <nav className="home-nav">
                    <button
                        type="button"
                        onClick={() => scrollToSection("home-section")}
                    >
                        Home
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("services-section")}
                    >
                        Services
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("how-it-works")}
                    >
                        How It Works
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("contact-section")}
                    >
                        Contact Us
                    </button>
                </nav>

                <div className="home-auth-buttons">
                    <button
                        type="button"
                        className="home-login-button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="home-signup-button"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            </header>

            {/* HERO */}
            <section className="home-hero" id="home-section">
                <div
                    className="home-hero-background"
                    style={{
                        backgroundImage: `url(${homeBg})`,
                    }}
                />

                <div className="home-hero-overlay" />

                <div className="home-hero-content">
                    <div className="home-hero-text">
                        <span className="home-tagline">
                            HOME SERVICE MANAGEMENT
                        </span>

                        <h2>
                            Quality Services,
                            <br />
                            Right at Your Doorstep
                        </h2>

                        <p>
                            Find trusted professionals for all your
                            home service needs. Book reliable services
                            quickly and conveniently.
                        </p>

                        <div className="home-hero-buttons">
                            <button
                                type="button"
                                className="home-primary-button"
                                onClick={() => navigate("/login")}
                            >
                                Book a Service
                            </button>

                            <button
                                type="button"
                                className="home-secondary-button"
                                onClick={() =>
                                    scrollToSection("services-section")
                                }
                            >
                                Explore Services
                            </button>
                        </div>
                    </div>

                    <div className="home-hero-card">
                        <div className="home-card-icon">✓</div>

                        <h3>Reliable Home Services</h3>

                        <p>
                            Book professional service providers for
                            your home whenever you need them.
                        </p>
                    </div>
                </div>

                {/* HERO FEATURES */}
                <div className="home-hero-features">
                    <div>
                        <span>✓</span>
                        <p>Trusted Professionals</p>
                    </div>

                    <div>
                        <span>◷</span>
                        <p>On-Time Service</p>
                    </div>

                    <div>
                        <span>★</span>
                        <p>Affordable Pricing</p>
                    </div>

                    <div>
                        <span>⌖</span>
                        <p>At Your Doorstep</p>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section
                className="home-service-showcase"
                id="services-section"
            >
                <div className="home-section-heading">
                    <span>EXPLORE SERVICES</span>

                    <h2>Everything Your Home Needs</h2>

                    <p>
                        Professional and reliable services delivered
                        by trusted providers.
                    </p>
                </div>

                <div className="home-service-image-grid">
                    {services.map((service) => (
                        <div
                            className="home-service-image-card"
                            key={service.number}
                        >
                            <div className="home-service-image-wrapper">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    loading="lazy"
                                />
                            </div>

                            <div className="home-service-image-content">
                                <span>{service.number}</span>

                                <h3>{service.name}</h3>

                                <p>{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* STATISTICS */}
            <section className="home-stats">
                <div className="home-stat-card">
                    <div className="home-stat-icon">👥</div>
                    <div>
                        <strong>500+</strong>
                        <span>Happy Customers</span>
                    </div>
                </div>

                <div className="home-stat-card">
                    <div className="home-stat-icon">♟</div>
                    <div>
                        <strong>100+</strong>
                        <span>Service Providers</span>
                    </div>
                </div>

                <div className="home-stat-card">
                    <div className="home-stat-icon">◉</div>
                    <div>
                        <strong>24/7</strong>
                        <span>Customer Support</span>
                    </div>
                </div>

                <div className="home-stat-card">
                    <div className="home-stat-icon">★</div>
                    <div>
                        <strong>4.8</strong>
                        <span>Average Rating</span>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                className="home-how-it-works"
                id="how-it-works"
            >
                <div className="home-how-heading">
                    <span>HOW IT WORKS</span>

                    <h2>Simple &amp; Convenient</h2>

                    <p>
                        Book the home service you need in just a few
                        simple steps.
                    </p>
                </div>

                <div className="home-how-grid">
                    <div className="home-how-card">
                        <div className="home-how-number">01</div>
                        <div className="home-how-icon">🔍</div>

                        <h3>Choose a Service</h3>

                        <p>
                            Browse our wide range of professional home
                            services and choose the service you need.
                        </p>
                    </div>

                    <div className="home-how-card">
                        <div className="home-how-number">02</div>
                        <div className="home-how-icon">📅</div>

                        <h3>Book a Service</h3>

                        <p>
                            Select your preferred date and available
                            booking slot to schedule your service.
                        </p>
                    </div>

                    <div className="home-how-card">
                        <div className="home-how-number">03</div>
                        <div className="home-how-icon">👨‍🔧</div>

                        <h3>Meet Your Provider</h3>

                        <p>
                            A trusted service provider will arrive at
                            your doorstep at the scheduled time.
                        </p>
                    </div>

                    <div className="home-how-card">
                        <div className="home-how-number">04</div>
                        <div className="home-how-icon">✓</div>

                        <h3>Get the Service</h3>

                        <p>
                            Sit back and enjoy reliable professional
                            service right at your doorstep.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section
                className="home-contact-section"
                id="contact-section"
            >
                <div className="home-section-heading">
                    <span>CONTACT US</span>

                    <h2>Get in Touch</h2>

                    <p>
                        Have a question or need help? Contact our
                        Home Service team.
                    </p>
                </div>

                <div className="home-contact-grid">
                    <div className="home-contact-card">
                        <div className="home-contact-icon">@</div>
                        <h3>Email</h3>
                        <p>support@homeservice.com</p>
                    </div>

                    <div className="home-contact-card">
                        <div className="home-contact-icon">☎</div>
                        <h3>Phone</h3>
                        <p>+91 98765 43210</p>
                    </div>

                    <div className="home-contact-card">
                        <div className="home-contact-icon">⌂</div>
                        <h3>Address</h3>
                        <p>Hyderabad, Telangana, India</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <div className="home-footer-brand">
                    <img src={logo} alt="Home Service" />

                    <div>
                        <h3>Home Service</h3>
                        <p>
                            Professional Services at Your Doorstep
                        </p>
                    </div>
                </div>

                <div className="home-footer-links">
                    <button
                        type="button"
                        onClick={() => scrollToSection("home-section")}
                    >
                        Home
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("services-section")}
                    >
                        Services
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("how-it-works")}
                    >
                        How It Works
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("contact-section")}
                    >
                        Contact Us
                    </button>
                </div>

                <p className="home-footer-copy">
                    © 2026 Home Service Management. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default Home;
