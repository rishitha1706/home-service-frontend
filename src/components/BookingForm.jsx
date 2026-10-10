import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function BookingForm() {
    const navigate = useNavigate();
    const { serviceId } = useParams();

    const [service, setService] = useState(null);

    const [customerName, setCustomerName] = useState(
        sessionStorage.getItem("name") || ""
    );
    const [contactNumber, setContactNumber] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [houseDetails, setHouseDetails] = useState("");
    const [landmark, setLandmark] = useState("");

    const [bookingDate, setBookingDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookingTime, setBookingTime] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [message, setMessage] = useState("");

    const locations = [
        "Hyderabad",
        "Secunderabad",
        "Uppal",
        "Pocharam",
        "Narapally",
        "Ghatkesar",
        "Kompally",
        "LB Nagar",
        "Madhapur",
        "Kondapur",
        "Kukatpally"
    ];

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/services/${serviceId}`);
                setService(response.data);
            } catch (error) {
                console.error("Failed to fetch service:", error);
                navigate("/customer");
            }
        };

        if (serviceId) {
            fetchService();
        }
    }, [serviceId, navigate]);

    useEffect(() => {
        const fetchCustomer = async () => {
            const userId = sessionStorage.getItem("userId");

            if (!userId) {
                return;
            }

            try {
                const response = await api.get(`/users/${userId}`);

                if (response.data.name) {
                    setCustomerName(response.data.name);
                }

                if (response.data.phone) {
                    setContactNumber(response.data.phone);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch customer details:",
                    error
                );
            }
        };

        fetchCustomer();
    }, []);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!bookingDate) {
                setAvailableSlots([]);
                setBookingTime("");
                return;
            }

            setLoadingSlots(true);
            setBookingTime("");
            setMessage("");

            try {
                const response = await api.get(
                    "/bookings/available-slots",
                    {
                        params: {
                            bookingDate: bookingDate
                        }
                    }
                );

                setAvailableSlots(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch available slots:",
                    error
                );

                setAvailableSlots([]);
                setMessage(
                    "Unable to load available time slots."
                );
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
    }, [bookingDate]);

    const handleBooking = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!customerName.trim()) {
            setMessage("Please enter your name.");
            return;
        }

        const cleanPhone = contactNumber.replace(/\D/g, "");

        if (cleanPhone.length !== 10) {
            setMessage(
                "Please enter a valid 10-digit contact number."
            );
            return;
        }

        if (!selectedLocation) {
            setMessage("Please select your location.");
            return;
        }

        if (!houseDetails.trim()) {
            setMessage(
                "Please enter your house or flat details."
            );
            return;
        }

        if (!landmark.trim()) {
            setMessage("Please enter a nearby landmark.");
            return;
        }

        if (!bookingDate) {
            setMessage("Please select a booking date.");
            return;
        }

        if (!bookingTime) {
            setMessage(
                "Please select an available time slot."
            );
            return;
        }

        setLoading(true);

        try {
            const userId = Number(
                sessionStorage.getItem("userId")
            );

            const completeAddress =
                `${houseDetails}, ${landmark}, ${selectedLocation}`;

            await api.put(`/users/${userId}`, {
                name: customerName,
                phone: cleanPhone,
                address: completeAddress
            });

            const bookingData = {
                customer: {
                    id: userId
                },

                service: {
                    id: service.id
                },

                bookingDate: bookingDate,

                bookingTime: bookingTime + ":00",

                address: completeAddress,

                totalPrice: service.price,

                status: "PENDING"
            };

            await api.post(
                "/bookings",
                bookingData
            );

            sessionStorage.setItem(
                "name",
                customerName
            );

            setMessage(
                "Booking created successfully."
            );

            setTimeout(() => {
                navigate("/customer/bookings");
            }, 1000);

        } catch (error) {
            console.error(
                "Booking failed:",
                error
            );

            setMessage(
                error.response?.data ||
                "Failed to create booking."
            );
        } finally {
            setLoading(false);
        }
    };

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    if (!service) {
        return (
            <div className="booking-page">
                <p>Loading service...</p>
            </div>
        );
    }

    return (
        <div className="booking-page">

            <header className="booking-page-header">

                <div>
                    <h1>Home Service</h1>
                    <p>Book your home service</p>
                </div>

                <button
                    className="booking-back-button"
                    onClick={() =>
                        navigate("/customer")
                    }
                >
                    Back
                </button>

            </header>

            <main className="booking-page-content">

                <div className="booking-page-card">

                    <h2>Book Service</h2>

                    <p className="booking-service-name">
                        {service.name}
                    </p>

                    <p className="booking-price">
                        ₹{service.price}
                    </p>

                    {message && (
                        <div className="booking-message">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleBooking}>

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your full name"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Contact Number
                            </label>

                            <input
                                type="tel"
                                value={contactNumber}
                                onChange={(e) =>
                                    setContactNumber(
                                        e.target.value
                                            .replace(/\D/g, "")
                                    )
                                }
                                placeholder="Enter 10-digit mobile number"
                                maxLength="10"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Select Your Location
                            </label>

                            <select
                                value={selectedLocation}
                                onChange={(e) =>
                                    setSelectedLocation(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select your location
                                </option>

                                {locations.map(
                                    (location) => (
                                        <option
                                            key={location}
                                            value={location}
                                        >
                                            {location}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                House / Flat / Building
                            </label>

                            <input
                                type="text"
                                value={houseDetails}
                                onChange={(e) =>
                                    setHouseDetails(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Flat 302, Sai Residency"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Nearby Landmark
                            </label>

                            <input
                                type="text"
                                value={landmark}
                                onChange={(e) =>
                                    setLandmark(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Near Uppal Metro Station"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Booking Date
                            </label>

                            <input
                                type="date"
                                value={bookingDate}
                                min={today}
                                onChange={(e) =>
                                    setBookingDate(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Available Time Slots
                            </label>

                            {!bookingDate ? (

                                <p className="slot-info">
                                    Select a booking date first.
                                </p>

                            ) : loadingSlots ? (

                                <p className="slot-info">
                                    Loading available slots...
                                </p>

                            ) : availableSlots.length === 0 ? (

                                <p className="slot-info">
                                    No available slots for this date.
                                </p>

                            ) : (

                                <div className="time-slot-container">

                                    {availableSlots.map(
                                        (slot) => (

                                            <button
                                                type="button"
                                                key={slot}
                                                className={
                                                    bookingTime === slot
                                                        ? "time-slot selected"
                                                        : "time-slot"
                                                }
                                                onClick={() =>
                                                    setBookingTime(
                                                        slot
                                                    )
                                                }
                                            >
                                                {formatTime(slot)}
                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                        <button
                            type="submit"
                            className="confirm-booking-button"
                            disabled={
                                loading ||
                                loadingSlots ||
                                !selectedLocation ||
                                !bookingTime ||
                                !customerName.trim() ||
                                !houseDetails.trim() ||
                                !landmark.trim()
                            }
                        >
                            {loading
                                ? "Booking..."
                                : "Confirm Booking"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");

    let hour = Number(hours);

    const period =
        hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minutes} ${period}`;
}

export default BookingForm;