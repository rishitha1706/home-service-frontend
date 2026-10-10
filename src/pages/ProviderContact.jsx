import { useNavigate } from "react-router-dom";
import logo from "../assets/homeservice-logo.jpg";

function ProviderContact() {

    const navigate = useNavigate();

    return (
        <div className="provider-dashboard">

            <header className="dashboard-header">

                <div className="header-brand">

                    <div className="app-logo">
                        <img
                            src={logo}
                            alt="Home Service"
                        />
                    </div>

                    <div>
                        <h1>Home Service</h1>
                        <p>Professional Services at Your Doorstep</p>
                    </div>

                </div>

                <button
                    type="button"
                    className="menu-button"
                    onClick={() => navigate("/provider")}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="provider-content">

                <section className="about-page">

                    <div className="about-hero-content">

                        <span className="about-label">
                            CONTACT US
                        </span>

                        <h2>
                            We're Here to Help
                        </h2>

                        <p>
                            If you need assistance with your service
                            provider account, bookings or services,
                            you can contact the Home Service team.
                        </p>

                    </div>

                    <section className="about-services">

                        <div className="about-section-heading">

                            <span>
                                GET IN TOUCH
                            </span>

                            <h2>
                                Contact Information
                            </h2>

                        </div>

                        <div className="about-service-grid">

                            <div className="about-service-card">
                                <span>01</span>

                                <h3>
                                    Phone
                                </h3>

                                <p>
                                    +91 98765 43210
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>02</span>

                                <h3>
                                    Email
                                </h3>

                                <p>
                                    support@homeservice.com
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>03</span>

                                <h3>
                                    Address
                                </h3>

                                <p>
                                    Hyderabad, Telangana, India
                                </p>
                            </div>

                        </div>

                    </section>

                  

                </section>

            </main>

        </div>
    );
}

export default ProviderContact;