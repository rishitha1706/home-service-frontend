import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import BookingForm from "../components/BookingForm";

function Services() {

    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedService, setSelectedService] = useState(null);

    const name = sessionStorage.getItem("name");

    useEffect(() => {

        const fetchServices = async () => {

            try {

                const response =
                    await api.get("/services");

                const availableServices =
                    response.data.filter(
                        (service) =>
                            service.available === true
                    );

                setServices(availableServices);

            } catch (error) {

                console.error(
                    "Failed to fetch services:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchServices();

    }, []);

    const filteredServices =
        services.filter((service) => {

            const search =
                searchTerm.toLowerCase().trim();

            if (!search) {
                return true;
            }

            const serviceName =
                service.name?.toLowerCase() || "";

            const category =
                service.category?.toLowerCase() || "";

            const description =
                service.description?.toLowerCase() || "";

            return (
                serviceName.includes(search) ||
                category.includes(search) ||
                description.includes(search)
            );
        });

    return (
        <div className="customer-dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Home Service</h1>

                    <p>
                        Welcome, {name}
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/customer")
                    }
                >
                    Back
                </button>

            </header>

            <main className="dashboard-content">

                <div className="services-page-header">

                    <div>
                        <h2>
                            Available Services
                        </h2>

                        <p>
                            Choose a service for your
                            home requirements.
                        </p>
                    </div>

                </div>

                <div className="service-search-container">

                    <input
                        type="text"
                        placeholder="Search for a service..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>

                {loading ? (

                    <div className="services-loading">
                        Loading available services...
                    </div>

                ) : filteredServices.length === 0 ? (

                    <div className="no-services">

                        <h3>
                            No services found
                        </h3>

                        <p>
                            Try searching for another
                            service.
                        </p>

                    </div>

                ) : (

                    <div className="service-grid">

                        {filteredServices.map(
                            (service) => (

                                <div
                                    className="service-card"
                                    key={service.id}
                                >

                                    <div className="service-image">

                                        <span>
                                            🛠️
                                        </span>

                                    </div>

                                    <h3>
                                        {service.name}
                                    </h3>

                                    <p className="category">
                                        {service.category}
                                    </p>

                                    <p>
                                        {service.description}
                                    </p>

                                    <h4>
                                        ₹{service.price}
                                    </h4>

                                    <button
                                        onClick={() =>
                                            setSelectedService(
                                                service
                                            )
                                        }
                                    >
                                        Book Service
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

            {selectedService && (

                <BookingForm
                    service={selectedService}
                    onClose={() =>
                        setSelectedService(null)
                    }
                />

            )}

        </div>
    );
}

export default Services;