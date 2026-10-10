import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/homeservice-logo.jpg";

function CustomerBookings() {
    const navigate = useNavigate();

    const name = sessionStorage.getItem("name");
    const userId = sessionStorage.getItem("userId");

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const [cancellingId, setCancellingId] = useState(null);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [actionMessage, setActionMessage] = useState("");

    const [reviewBookingId, setReviewBookingId] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewedBookings, setReviewedBookings] = useState({});

    // Initialize dismissed alerts once. No setState inside an effect.
    const [dismissedProviderAlerts, setDismissedProviderAlerts] =
        useState(() => {
            try {
                return JSON.parse(
                    sessionStorage.getItem(
                        `dismissed-provider-alerts-${userId}`
                    ) || "[]"
                ).map(String);
            } catch {
                return [];
            }
        });

    // Derive the popup directly from bookings and dismissed IDs.
    const providerAlertBooking = bookings.find((booking) => {
        return (
            Boolean(booking.cancellationMessage) &&
            booking.status?.toUpperCase() === "CANCELLED" &&
            !dismissedProviderAlerts.includes(String(booking.id))
        );
    });

    const dismissProviderAlert = () => {
        if (!providerAlertBooking) return;

        const updatedDismissed = [
            ...dismissedProviderAlerts,
            String(providerAlertBooking.id),
        ];

        setDismissedProviderAlerts(updatedDismissed);

        sessionStorage.setItem(
            `dismissed-provider-alerts-${userId}`,
            JSON.stringify(updatedDismissed)
        );
    };

    const loadBookingData = async (showLoading = true) => {
        if (!userId) {
            setLoading(false);
            setError("User not logged in.");
            return;
        }

        try {
            if (showLoading) setLoading(true);

            setError("");

            const response = await api.get(
                `/bookings/customer/${userId}`
            );

            const bookingData = Array.isArray(response.data)
                ? response.data
                : [];

            const reviewStatus = {};
            const completedBookings = bookingData.filter(
                (booking) =>
                    booking.status?.toUpperCase() === "COMPLETED"
            );

            await Promise.all(
                completedBookings.map(async (booking) => {
                    try {
                        await api.get(`/reviews/booking/${booking.id}`);
                        reviewStatus[booking.id] = true;
                    } catch {
                        reviewStatus[booking.id] = false;
                    }
                })
            );

            setBookings(bookingData);
            setReviewedBookings(reviewStatus);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setError("Unable to load your bookings.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

 useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
        if (!userId) {
            if (!cancelled) {
                setError("User not logged in.");
                setLoading(false);
            }
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/bookings/customer/${userId}`
            );

            if (cancelled) return;

            const bookingData = Array.isArray(response.data)
                ? response.data
                : [];

            const reviewStatus = {};

            const completedBookings = bookingData.filter(
                (booking) =>
                    booking.status?.toUpperCase() === "COMPLETED"
            );

            await Promise.all(
                completedBookings.map(async (booking) => {
                    try {
                        await api.get(`/reviews/booking/${booking.id}`);
                        reviewStatus[booking.id] = true;
                    } catch {
                        reviewStatus[booking.id] = false;
                    }
                })
            );

            if (cancelled) return;

            setBookings(bookingData);
            setReviewedBookings(reviewStatus);
        } catch (err) {
            if (!cancelled) {
                console.error("Failed to fetch bookings:", err);
                setError("Unable to load your bookings.");
            }
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    };

    fetchBookings();

    return () => {
        cancelled = true;
    };
}, [userId]);

    const refreshBookings = async () => {
        setRefreshing(true);
        await loadBookingData(false);
    };

    const cancelBooking = async (booking) => {
        if (!booking) return;

        const status = booking.status?.toUpperCase();

        if (status !== "PENDING" && status !== "CONFIRMED") {
            setActionMessage("This booking cannot be cancelled.");
            setBookingToCancel(null);
            return;
        }

        try {
            setCancellingId(booking.id);
            setBookingToCancel(null);
            setActionMessage("");
            setError("");

            await api.put(`/bookings/${booking.id}/cancel`);

            setActionMessage(
                `Booking #${booking.id} cancelled successfully.`
            );

            await loadBookingData(false);
        } catch (err) {
            console.error("Failed to cancel booking:", err);

            setActionMessage(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "Unable to cancel this booking. Please try again."
            );
        } finally {
            setCancellingId(null);
        }
    };

    const logout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    const closeMenu = () => setMenuOpen(false);

    const goToServices = () => {
        closeMenu();
        navigate("/customer");
    };

    const formatDate = (date) => {
        if (!date) return "";

        const parts = date.split("-");

        if (parts.length !== 3) return date;

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const formatTime = (time) => {
        if (!time) return "";

        const parts = time.split(":");

        if (parts.length < 2) return time;

        let hour = Number(parts[0]);
        const minutes = parts[1];
        const period = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12;

        return `${hour}:${minutes} ${period}`;
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case "CONFIRMED":
                return "status-confirmed";
            case "COMPLETED":
                return "status-completed";
            case "CANCELLED":
            case "REJECTED":
                return "status-cancelled";
            default:
                return "status-pending";
        }
    };

    const openReview = (bookingId) => {
        setReviewBookingId(bookingId);
        setRating(0);
        setReviewText("");
        setReviewMessage("");
    };

    const closeReview = () => {
        if (reviewLoading) return;

        setReviewBookingId(null);
        setRating(0);
        setReviewText("");
        setReviewMessage("");
    };

    const submitReview = async () => {
        if (rating < 1 || rating > 5) {
            setReviewMessage("Please select a rating from 1 to 5 stars.");
            return;
        }

        setReviewLoading(true);
        setReviewMessage("");

        try {
            await api.post("/reviews", null, {
                params: {
                    bookingId: reviewBookingId,
                    rating,
                    review: reviewText.trim(),
                },
            });

            setReviewedBookings((previous) => ({
                ...previous,
                [reviewBookingId]: true,
            }));

            setReviewMessage("Thank you for your rating and review.");

            setTimeout(() => {
                setReviewBookingId(null);
                setRating(0);
                setReviewText("");
                setReviewMessage("");
            }, 1200);
        } catch (err) {
            console.error("Failed to submit review:", err);

            setReviewMessage(
                err.response?.data || "Failed to submit review."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <div className="customer-dashboard">
            <header className="dashboard-header">
                <div className="header-brand">
                    <div className="home-logo">
                        <img src={logo} alt="Home Service" />
                    </div>

                    <div>
                        <h1>Home Service</h1>
                        <p>Welcome, {name}</p>
                    </div>
                </div>

                <button
                    className="menu-button"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                >
                    ☰
                </button>
            </header>

            {menuOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeMenu}
                />
            )}

            <aside
                className={`customer-sidebar ${
                    menuOpen ? "sidebar-open" : ""
                }`}
            >
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <img src={logo} alt="Home Service" />
                    </div>

                    <div>
                        <h2>Home Service</h2>
                        <p>Customer Menu</p>
                    </div>

                    <button
                        className="sidebar-close"
                        onClick={closeMenu}
                    >
                        ×
                    </button>
                </div>

                <div className="sidebar-menu">
                    <button
                        onClick={() => {
                            closeMenu();
                            navigate("/customer/bookings");
                        }}
                    >
                        <span>My Bookings</span>
                    </button>

                    <button
                        onClick={() => {
                            closeMenu();
                            navigate("/customer/about");
                        }}
                    >
                        <span>About</span>
                    </button>

                    <button
                        onClick={() => {
                            closeMenu();
                            navigate("/customer/contact");
                        }}
                    >
                        <span>Contact Us</span>
                    </button>

                    <button
                        onClick={() => {
                            closeMenu();
                            navigate("/customer/settings");
                        }}
                    >
                        <span>Settings</span>
                    </button>

                    <button
                        className="customer-back-dashboard"
                        onClick={() => navigate("/customer")}
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="sidebar-bottom">
                    <button
                        onClick={logout}
                        className="sidebar-logout"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="bookings-header">
                    <div>
                        <h2>My Bookings</h2>
                        <p>View and manage your service bookings</p>
                    </div>

                    <div className="booking-header-actions">
                        <button
                            type="button"
                            className="refresh-bookings-button"
                            onClick={refreshBookings}
                            disabled={loading || refreshing}
                        >
                            {refreshing ? (
                                <>
                                    <span className="refresh-spinner" />
                                    Refreshing...
                                </>
                            ) : (
                                "↻ Refresh"
                            )}
                        </button>

                        <button
                            type="button"
                            className="book-service-button"
                            onClick={goToServices}
                        >
                            Book New Service
                        </button>
                    </div>
                </div>

                {!userId && (
                    <div className="booking-error">
                        User not logged in.
                    </div>
                )}

                {actionMessage && (
                    <div className="booking-message">
                        {actionMessage}
                    </div>
                )}

                {loading && userId && (
                    <div className="booking-loading">
                        Loading your bookings...
                    </div>
                )}

                {error && (
                    <div className="booking-error">{error}</div>
                )}

                {!loading &&
                    !error &&
                    userId &&
                    bookings.length === 0 && (
                        <div className="no-bookings">
                            <h3>No bookings yet</h3>
                            <p>
                                You haven't booked any home services yet.
                            </p>
                            <button onClick={goToServices}>
                                Browse Services
                            </button>
                        </div>
                    )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="bookings-grid">
                        {bookings.map((booking) => {
                            const status = booking.status?.toUpperCase();

                            const canCancel =
                                status === "PENDING" ||
                                status === "CONFIRMED";

                            return (
                                <div
                                    className="booking-card"
                                    key={booking.id}
                                >
                                    <div className="booking-card-header">
                                        <div>
                                            <h3>
                                                {booking.serviceName ||
                                                    "Service unavailable"}
                                            </h3>
                                            <span>
                                                Booking #{booking.id}
                                            </span>
                                        </div>

                                        <span
                                            className={`booking-status ${getStatusClass(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="booking-details">
                                        <div className="booking-detail">
                                            <span className="detail-label">
                                                Service Provider
                                            </span>
                                            <span className="detail-value">
                                                {booking.providerName ||
                                                    "Provider unavailable"}
                                            </span>
                                        </div>

                                        <div className="booking-detail">
                                            <span className="detail-label">
                                                Phone
                                            </span>
                                            <span className="detail-value">
                                                {booking.providerPhone || "-"}
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
                                                {booking.address}
                                            </span>
                                        </div>
                                    </div>

                                    {status === "CANCELLED" &&
                                        booking.cancellationMessage && (
                                            <div
                                                className="booking-message"
                                                role="status"
                                            >
                                                {booking.cancellationMessage}
                                            </div>
                                        )}

                                    <div className="booking-card-footer">
                                        <span>Total Price</span>
                                        <strong>
                                            ₹{booking.totalPrice}
                                        </strong>
                                    </div>

                                    {canCancel && (
                                        <div className="booking-actions">
                                            <button
                                                type="button"
                                                className="cancel-booking-button"
                                                onClick={() =>
                                                    setBookingToCancel(booking)
                                                }
                                                disabled={
                                                    cancellingId === booking.id
                                                }
                                            >
                                                {cancellingId === booking.id
                                                    ? "Cancelling..."
                                                    : "Cancel Booking"}
                                            </button>
                                        </div>
                                    )}

                                    {status === "COMPLETED" && (
                                        <div className="booking-review-section">
                                            {reviewedBookings[booking.id] ? (
                                                <button
                                                    type="button"
                                                    className="reviewed-button"
                                                    disabled
                                                >
                                                    Reviewed
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="rate-review-button"
                                                    onClick={() =>
                                                        openReview(booking.id)
                                                    }
                                                >
                                                    Rate & Review
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Provider unavailable popup */}
            {providerAlertBooking && (
                <div
                    className="cancel-modal-overlay"
                    onClick={dismissProviderAlert}
                    style={{ zIndex: 1200 }}
                >
                    <div
                        className="cancel-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="provider-unavailable-title"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: "480px" }}
                    >
                        <div
                            className="cancel-modal-icon"
                            style={{
                                background: "#fff1f0",
                                color: "#c62828",
                            }}
                        >
                            !
                        </div>

                        <h2 id="provider-unavailable-title">
                            Booking Cancelled
                        </h2>

                        <p>
                            {providerAlertBooking.cancellationMessage}
                        </p>

                        <span className="cancel-booking-reference">
                            Booking #{providerAlertBooking.id}
                        </span>

                        <div className="cancel-modal-actions">
                            <button
                                type="button"
                                className="confirm-cancel-button"
                                onClick={dismissProviderAlert}
                            >
                                Okay, I Understand
                            </button>

                            <button
                                type="button"
                                className="keep-booking-button"
                                onClick={() => {
                                    dismissProviderAlert();
                                    navigate("/customer");
                                }}
                            >
                                Book Another Service
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer cancellation confirmation */}
            {bookingToCancel && (
                <div
                    className="cancel-modal-overlay"
                    onClick={() => setBookingToCancel(null)}
                >
                    <div
                        className="cancel-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cancel-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="cancel-modal-icon">!</div>

                        <h2 id="cancel-modal-title">
                            Cancel Booking?
                        </h2>

                        <p>
                            Are you sure you want to cancel your booking for{" "}
                            <strong>
                                {bookingToCancel.serviceName}
                            </strong>
                            ?
                        </p>

                        <span className="cancel-booking-reference">
                            Booking #{bookingToCancel.id}
                        </span>

                        <div className="cancel-modal-actions">
                            <button
                                type="button"
                                className="keep-booking-button"
                                onClick={() => setBookingToCancel(null)}
                            >
                                Keep Booking
                            </button>

                            <button
                                type="button"
                                className="confirm-cancel-button"
                                onClick={() =>
                                    cancelBooking(bookingToCancel)
                                }
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review popup */}
            {reviewBookingId && (
                <div
                    className="review-modal-overlay"
                    onClick={closeReview}
                >
                    <div
                        className="review-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="review-modal-header">
                            <h2>Rate Your Service</h2>

                            <button
                                type="button"
                                className="review-close-button"
                                onClick={closeReview}
                                disabled={reviewLoading}
                            >
                                ×
                            </button>
                        </div>

                        <p className="review-subtitle">
                            How was your service experience?
                        </p>

                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className={
                                        star <= rating
                                            ? "rating-star selected"
                                            : "rating-star"
                                    }
                                    onClick={() => setRating(star)}
                                    disabled={reviewLoading}
                                    aria-label={`${star} star rating`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <p className="rating-text">
                            {rating === 0 && "Select your rating"}
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Below Average"}
                            {rating === 3 && "Average"}
                            {rating === 4 && "Good"}
                            {rating === 5 && "Excellent"}
                        </p>

                        <div className="review-form-group">
                            <label htmlFor="review-text">
                                Your Review
                            </label>

                            <textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(e) =>
                                    setReviewText(e.target.value)
                                }
                                placeholder="Tell us about your service experience..."
                                rows={5}
                                maxLength={1000}
                                disabled={reviewLoading}
                            />

                            <span className="review-character-count">
                                {reviewText.length}/1000
                            </span>
                        </div>

                        {reviewMessage && (
                            <div className="review-message">
                                {reviewMessage}
                            </div>
                        )}

                        <div className="review-modal-actions">
                            <button
                                type="button"
                                className="review-cancel-button"
                                onClick={closeReview}
                                disabled={reviewLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="review-submit-button"
                                onClick={submitReview}
                                disabled={reviewLoading || rating === 0}
                            >
                                {reviewLoading
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerBookings;