import { useNavigate } from "react-router-dom";
import logo from "../assets/homeservice-logo.jpg";

function About() {
    const navigate = useNavigate();

    return (
        <div className="customer-dashboard">

            {/* ================= HEADER ================= */}

            <header className="dashboard-header">

                <div className="header-brand">

                    <div className="home-logo">
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
                    onClick={() => navigate("/customer")}
                >
                    Back to Dashboard
                </button>

            </header>


            {/* ================= ABOUT CONTENT ================= */}

            <main className="about-page">

                <section className="about-hero">

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
                            Home Service Management connects customers
                            with trusted professionals for their everyday
                            home service requirements.
                        </p>

                        <p>
                            From plumbing and electrical work to cleaning,
                            appliance repair and other household services,
                            customers can easily find and book the service
                            they need.
                        </p>

                        

                    </div>

                </section>


                {/* ================= ALL SERVICES ================= */}

                <section className="about-services">

                    <div className="about-section-heading">

                        <span>
                            WHAT WE OFFER
                        </span>

                        <h2>
                            Services For Your Home
                        </h2>

                        <p>
                            Reliable professionals for your everyday
                            home service needs.
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
                                Installation, servicing and washing machine repairs.
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


                {/* ================= WHY CHOOSE US ================= */}

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
                            customers to discover services, choose
                            professionals and manage their bookings
                            from one place.
                        </p>

                    </div>


                    <div className="about-benefits">

                        <div className="about-benefit">

                            <strong>01</strong>

                            <div>
                                <h3>Trusted Professionals</h3>

                                <p>
                                    Connect with registered service
                                    providers.
                                </p>
                            </div>

                        </div>


                        <div className="about-benefit">

                            <strong>02</strong>

                            <div>
                                <h3>Easy Booking</h3>

                                <p>
                                    Book required services quickly
                                    and conveniently.
                                </p>
                            </div>

                        </div>


                        <div className="about-benefit">

                            <strong>03</strong>

                            <div>
                                <h3>Convenient Management</h3>

                                <p>
                                    Manage your home service bookings
                                    in one place.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= BACK BUTTON ================= */}

               

               

            </main>

        </div>
    );
}

export default About;