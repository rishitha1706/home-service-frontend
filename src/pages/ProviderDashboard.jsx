import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import logo from "../assets/homeservice-logo.jpg";

function ProviderDashboard() {

    const navigate = useNavigate();

    const name =
        sessionStorage.getItem("name") || "Provider";

    const userId =
        sessionStorage.getItem("userId");

    const [provider, setProvider] = useState(null);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(
        Boolean(userId)
    );

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");
    const [updatingBooking, setUpdatingBooking] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);

    /* =========================
       LOAD PROVIDER DATA
       ========================= */

    useEffect(() => {

        if (!userId) {
          
            return;
        }

        let cancelled = false;

        const fetchProviderData = async () => {

            try {

                setError("");

                const providerResponse =
                    await api.get(
                        `/providers/user/${userId}`
                    );

                if (cancelled) {
                    return;
                }

                const providerData =
                    providerResponse.data;

                setProvider(providerData);

                const bookingsResponse =
                    await api.get(
                        `/bookings/provider/${providerData.id}`
                    );

                if (cancelled) {
                    return;
                }

                setBookings(
                    Array.isArray(bookingsResponse.data)
                        ? bookingsResponse.data
                        : []
                );

            } catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load provider data:",
                    error
                );

                setError(
                    error.response?.data ||
                    "Unable to load provider information."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        fetchProviderData();

        return () => {
            cancelled = true;
        };

    }, [userId]);

    /* =========================
       REFRESH BOOKINGS
       ========================= */

    const fetchBookings = async () => {

        if (!provider?.id || refreshing) {
            return;
        }

        try {

            setRefreshing(true);
            setError("");

            const response =
                await api.get(
                    `/bookings/provider/${provider.id}`
                );

            setBookings(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to refresh bookings:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to refresh bookings."
            );

        } finally {

            setRefreshing(false);

        }

    };

    /* =========================
       LOGOUT
       ========================= */

    const logout = () => {

        sessionStorage.clear();

        window.location.href = "/login";

    };

    /* =========================
       CLOSE MENU
       ========================= */

    const closeMenu = () => {

        setMenuOpen(false);

    };

    /* =========================
       DATE FORMAT
       ========================= */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parts = date.split("-");

        if (parts.length !== 3) {
            return date;
        }

        return `${parts[2]}-${parts[1]}-${parts[0]}`;

    };

    /* =========================
       TIME FORMAT
       ========================= */

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        const parts = time.split(":");

        if (parts.length < 2) {
            return time;
        }

        let hour = Number(parts[0]);

        const minutes = parts[1];

        const period =
            hour >= 12
                ? "PM"
                : "AM";

        hour = hour % 12 || 12;

        return `${hour}:${minutes} ${period}`;

    };

    /* =========================
       STATUS CLASS
       ========================= */

    const getStatusClass = (status) => {

        switch (
            status?.toUpperCase()
        ) {

            case "CONFIRMED":
                return "status-confirmed";

            case "COMPLETED":
                return "status-completed";

            case "CANCELLED":
                return "status-cancelled";

            case "REJECTED":
                return "status-cancelled";

            default:
                return "status-pending";

        }

    };

    /* =========================
       UPDATE BOOKING STATUS
       ========================= */

    const updateBookingStatus = async (
        bookingId,
        newStatus
    ) => {

        try {

            setUpdatingBooking(bookingId);
            setError("");

            await api.put(
                `/bookings/${bookingId}`,
                {
                    status: newStatus
                }
            );

            setBookings(
                (currentBookings) =>
                    currentBookings.map(
                        (booking) =>
                            booking.id === bookingId
                                ? {
                                    ...booking,
                                    status: newStatus
                                }
                                : booking
                    )
            );

        } catch (error) {

            console.error(
                "Failed to update booking:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to update booking."
            );

        } finally {

            setUpdatingBooking(null);

        }

    };

    /* =========================
       INITIAL LOADING
       ========================= */

    if (loading) {

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

                            <h1>
                                Home Service
                            </h1>

                            <p>
                                Welcome, {name}
                            </p>

                        </div>

                    </div>

                </header>

                <main className="provider-content">

                    <div className="booking-loading">
                        Loading provider dashboard...
                    </div>

                </main>

            </div>

        );

    }

    return (

        <div className="provider-dashboard">

            {/* =========================
                HEADER
               ========================= */}

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
                            Welcome, {name}
                        </p>

                    </div>

                </div>

                <button
                    className="menu-button"
                    onClick={() =>
                        setMenuOpen(true)
                    }
                    aria-label="Open menu"
                >
                    ☰
                </button>

            </header>

            {/* =========================
                SIDEBAR
               ========================= */}

            {menuOpen && (

                <>

                    <div
                        className="sidebar-overlay"
                        onClick={closeMenu}
                    ></div>

                    <aside className="provider-sidebar">

                        <div className="provider-sidebar-header">

                            <div className="provider-sidebar-brand">

                                <img
                                    src={logo}
                                    alt="Home Service"
                                />

                                <div>

                                    <h2>
                                        Home Service
                                    </h2>

                                    <p>
                                        Provider Menu
                                    </p>

                                </div>

                            </div>

                            <button
                                className="provider-sidebar-close"
                                onClick={closeMenu}
                            >
                                ×
                            </button>

                        </div>

                        <div className="provider-sidebar-menu">

                            

                            <button
                                onClick={() => {

                                    closeMenu();

                                    navigate(
                                        "/provider/about"
                                    );

                                }}
                            >
                                About
                            </button>

                            <button
                                onClick={() => {

                                    closeMenu();

                                    navigate(
                                        "/provider/contact"
                                    );

                                }}
                            >
                                Contact Us
                            </button>

                            <button
                                onClick={() => {

                                    closeMenu();

                                    navigate(
                                        "/provider/settings"
                                    );

                                }}
                            >
                                Settings
                            </button>

                        </div>

                        <div className="provider-sidebar-footer">

                            <button
                                className="provider-sidebar-logout"
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </div>

                    </aside>

                </>

            )}

            {/* =========================
                MAIN CONTENT
               ========================= */}

            <main className="provider-content">

                {error && (

                    <div className="booking-error">
                        {error}
                    </div>

                )}

                {/* =========================
                    PROVIDER PROFILE
                   ========================= */}

                {provider && (

                    <section className="provider-profile-card">

                        <div className="provider-profile-header">

                            <h2>
                                Provider Profile
                            </h2>

                            <p className="provider-specialization">
                                {provider.specialization}
                            </p>

                        </div>

                        <div className="provider-info">

                            <div>

                                <span>
                                    Experience
                                </span>

                                <strong>
                                    {provider.experience}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Rating
                                </span>

                                <strong>
                                    {provider.rating}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Availability
                                </span>

                                <strong>
                                    {provider.available
                                        ? "Available"
                                        : "Unavailable"}
                                </strong>

                            </div>

                        </div>

                    </section>

                )}

                {/* =========================
                    ASSIGNED BOOKINGS
                   ========================= */}

                <section className="provider-bookings-section">

                    <div className="bookings-header">

                        <div>

                            <h2>
                                Assigned Bookings
                            </h2>

                            <p>
                                Manage your assigned
                                home service bookings
                            </p>

                        </div>

                        <button
                            type="button"
                            className="refresh-bookings-button"
                            onClick={fetchBookings}
                            disabled={refreshing}
                        >

                            <span
                                className={
                                    refreshing
                                        ? "refresh-icon spinning"
                                        : "refresh-icon"
                                }
                            >
                                ↻
                            </span>

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}

                        </button>

                    </div>

                    {/* =========================
                        NO BOOKINGS
                       ========================= */}

                    {bookings.length === 0 ? (

                        <div className="no-bookings">

                            <h3>
                                No bookings assigned
                            </h3>

                            <p>
                                You currently don't have
                                any customer bookings.
                            </p>

                        </div>

                    ) : (

                        <div className="bookings-grid">

                            {bookings.map(
                                (booking) => (

                                    <div
                                        className="booking-card"
                                        key={booking.id}
                                    >

                                        <div className="booking-card-header">

                                            <div>

                                                <h3>
                                                    {
                                                        booking.serviceName
                                                    }
                                                </h3>

                                                <span>
                                                    Booking #
                                                    {
                                                        booking.id
                                                    }
                                                </span>

                                            </div>

                                            <span
                                                className={
                                                    `booking-status ${getStatusClass(
                                                        booking.status
                                                    )}`
                                                }
                                            >
                                                {
                                                    booking.status
                                                }
                                            </span>

                                        </div>

                                        <div className="booking-details">

                                            <div className="booking-detail">

                                                <span className="detail-label">
                                                    Customer
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        booking.customerName
                                                    }
                                                </span>

                                            </div>
<div className="booking-detail">
    <span className="detail-label">
        Phone
    </span>

    <span className="detail-value">
        {booking.customerPhone || "-"}
    </span>
</div>
                                            <div className="booking-detail">

                                                <span className="detail-label">
                                                    Date
                                                </span>

                                                <span className="detail-value">
                                                    {formatDate(
                                                        booking.bookingDate
                                                    )}
                                                </span>

                                            </div>

                                            <div className="booking-detail">

                                                <span className="detail-label">
                                                    Time
                                                </span>

                                                <span className="detail-value">
                                                    {formatTime(
                                                        booking.bookingTime
                                                    )}
                                                </span>

                                            </div>

                                            <div className="booking-detail">

                                                <span className="detail-label">
                                                    Address
                                                </span>

                                                <span className="detail-value">
                                                    {
                                                        booking.address
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        <div className="booking-card-footer">

                                            <span>
                                                Total Price
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    booking.totalPrice
                                                }
                                            </strong>

                                        </div>

                                        <div className="booking-actions">

                                            {booking.status ===
                                                "PENDING" && (

                                                <>

                                                    <button
                                                        className="confirm-button"
                                                        disabled={
                                                            updatingBooking ===
                                                            booking.id
                                                        }
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "CONFIRMED"
                                                            )
                                                        }
                                                    >
                                                        {
                                                            updatingBooking ===
                                                                booking.id
                                                                ? "Updating..."
                                                                : "Confirm"
                                                        }
                                                    </button>

                                                    <button
                                                        className="cancel-button"
                                                        disabled={
                                                            updatingBooking ===
                                                            booking.id
                                                        }
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "CANCELLED"
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </>

                                            )}

                                            {booking.status ===
                                                "CONFIRMED" && (

                                                <>

                                                    <button
                                                        className="complete-button"
                                                        disabled={
                                                            updatingBooking ===
                                                            booking.id
                                                        }
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "COMPLETED"
                                                            )
                                                        }
                                                    >
                                                        {
                                                            updatingBooking ===
                                                                booking.id
                                                                ? "Updating..."
                                                                : "Complete"
                                                        }
                                                    </button>

                                                    <button
                                                        className="cancel-button"
                                                        disabled={
                                                            updatingBooking ===
                                                            booking.id
                                                        }
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "CANCELLED"
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>

    );
}

export default ProviderDashboard;