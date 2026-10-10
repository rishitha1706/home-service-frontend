import { useNavigate } from "react-router-dom";
import logo from "../assets/homeservice-logo.jpg";

function ProviderAbout() {

    const navigate = useNavigate();

    return (
        <div className="provider-dashboard">

            {/* ================= HEADER ================= */}

            <header className="dashboard-header">

                <div className="header-brand">

                    <div className="app-logo">
                        <img
                            src={logo}
                            alt="Home Service"
                        />
                    </div>

                    <div>
                        <h1>
                            Home Service
                        </h1>

                        <p>
                            Professional Services at Your Doorstep
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="menu-button"
                    onClick={() =>
                        navigate("/provider")
                    }
                >
                    Back to Dashboard
                </button>

            </header>


            {/* ================= ABOUT CONTENT ================= */}

            <main className="provider-content">

                <section className="about-page">

                    <div className="about-hero">

                        <div className="about-hero-content">

                            <span className="about-label">
                                ABOUT US
                            </span>

                            <h2>
                                Professional Home Services
                                <br />
                                Made Simple
                            </h2>

                            <p>
                                Home Service Management connects
                                customers with trusted professionals
                                for their everyday home service
                                requirements.
                            </p>

                            <p>
                                As a service provider, you can manage
                                your profile, view customer bookings
                                and provide reliable services through
                                our platform.
                            </p>

                        </div>

                    </div>


                    {/* ================= SERVICES ================= */}

                    <section className="about-services">

                        <div className="about-section-heading">

                            <span>
                                WHAT WE OFFER
                            </span>

                            <h2>
                                Services For Your Home
                            </h2>

                            <p>
                                Reliable professionals for your
                                everyday home service needs.
                            </p>

                        </div>


                        <div className="about-service-grid">

                            <div className="about-service-card">
                                <span>01</span>
                                <h3>AC Repair</h3>
                                <p>
                                    AC servicing, installation and repairs.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>02</span>
                                <h3>AC Installation</h3>
                                <p>
                                    Professional AC installation services.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>03</span>
                                <h3>Plumbing Repair</h3>
                                <p>
                                    Reliable plumbing solutions for your home.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>04</span>
                                <h3>Electrician</h3>
                                <p>
                                    Safe and reliable electrical services.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>05</span>
                                <h3>Home Cleaning</h3>
                                <p>
                                    Quality cleaning services for a comfortable home.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>06</span>
                                <h3>Bathroom Cleaning</h3>
                                <p>
                                    Professional bathroom cleaning services.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>07</span>
                                <h3>Painting</h3>
                                <p>
                                    Interior and exterior painting services.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>08</span>
                                <h3>Carpentry</h3>
                                <p>
                                    Professional furniture and carpentry solutions.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>09</span>
                                <h3>Pest Control</h3>
                                <p>
                                    Professional pest control solutions for your home.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>10</span>
                                <h3>Washing Machine Repair</h3>
                                <p>
                                    Installation, servicing and repairs.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>11</span>
                                <h3>Refrigerator Repair</h3>
                                <p>
                                    Refrigerator repair and cooling solutions.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>12</span>
                                <h3>RO Water Purifier Service</h3>
                                <p>
                                    RO installation, filter replacement and maintenance.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>13</span>
                                <h3>Geyser Repair</h3>
                                <p>
                                    Geyser servicing and repair solutions.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>14</span>
                                <h3>Fan Repair</h3>
                                <p>
                                    Professional fan repair and maintenance.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>15</span>
                                <h3>TV Repair</h3>
                                <p>
                                    Reliable television repair and servicing.
                                </p>
                            </div>

                            <div className="about-service-card">
                                <span>16</span>
                                <h3>Gardening</h3>
                                <p>
                                    Garden maintenance, trimming and planting.
                                </p>
                            </div>

                        </div>

                    </section>


                    {/* ================= WHY HOME SERVICE ================= */}

                    <section className="about-why">

                        <div className="about-why-content">

                            <span className="about-label">
                                WHY HOME SERVICE
                            </span>

                            <h2>
                                Making Home Services
                                <br />
                                Easier For Everyone
                            </h2>

                            <p>
                                Our platform makes it convenient for
                                customers to discover services and
                                connect with professionals.
                            </p>

                        </div>


                        <div className="about-benefits">

                            <div className="about-benefit">

                                <strong>01</strong>

                                <div>
                                    <h3>
                                        Professional Platform
                                    </h3>

                                    <p>
                                        Manage your service profile
                                        and customer bookings.
                                    </p>
                                </div>

                            </div>


                            <div className="about-benefit">

                                <strong>02</strong>

                                <div>
                                    <h3>
                                        Easy Booking Management
                                    </h3>

                                    <p>
                                        View and manage your assigned
                                        service bookings.
                                    </p>
                                </div>

                            </div>


                            <div className="about-benefit">

                                <strong>03</strong>

                                <div>
                                    <h3>
                                        Convenient Management
                                    </h3>

                                    <p>
                                        Manage your home service work
                                        from one place.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================= BACK BUTTON ================= */}

                   

                </section>

            </main>

        </div>
    );
}

export default ProviderAbout;