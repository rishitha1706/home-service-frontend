
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/homeservice-logo.jpg";

const emptyServiceForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  available: true,
};

const asArray = (response) => {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content?.content)) return data.content.content;
  return [];
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (error?.message) return error.message;
  return fallback;
};

const display = (value, fallback = "-") =>
  value === null || value === undefined || value === "" ? fallback : value;

const getBookingStatus = (booking) =>
  String(booking?.status || "PENDING").toUpperCase();

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingService, setDeletingService] = useState(null);
  const [deletingProvider, setDeletingProvider] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [addingService, setAddingService] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);

  const currentUserId = Number(sessionStorage.getItem("userId"));

  // Load all admin data.
  const loadAdminData = useCallback(async () => {
    const [
      usersResponse,
      servicesResponse,
      providersResponse,
      bookingsResponse,
    ] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/services"),
      api.get("/admin/providers"),
      api.get("/admin/bookings"),
    ]);

    setUsers(asArray(usersResponse));
    setServices(asArray(servicesResponse));
    setProviders(asArray(providersResponse));
    setBookings(asArray(bookingsResponse));
  }, []);

  // Initial dashboard load.
  useEffect(() => {
    let cancelled = false;

    const initialLoad = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          usersResponse,
          servicesResponse,
          providersResponse,
          bookingsResponse,
        ] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/services"),
          api.get("/admin/providers"),
          api.get("/admin/bookings"),
        ]);

        if (cancelled) return;

        setUsers(asArray(usersResponse));
        setServices(asArray(servicesResponse));
        setProviders(asArray(providersResponse));
        setBookings(asArray(bookingsResponse));
      } catch (err) {
        if (!cancelled) {
          console.error("Admin dashboard load failed:", err);
          setError(
            getErrorMessage(err, "Unable to load admin dashboard.")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  // Automatically refresh bookings every 10 seconds.
  useEffect(() => {
    let cancelled = false;

    const fetchLatestBookings = async () => {
      try {
        const response = await api.get("/admin/bookings");

        if (!cancelled) {
          setBookings(asArray(response));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to refresh recent bookings:", err);
        }
      }
    };

    const intervalId = setInterval(fetchLatestBookings, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchLatestBookings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // Manual refresh button.
  const refreshAdminData = async () => {
    if (refreshing) return;

    setRefreshing(true);
    setError("");
    setSuccess("");

    try {
      await loadAdminData();
      setSuccess("Dashboard data refreshed.");
    } catch (err) {
      console.error("Admin dashboard refresh failed:", err);
      setError(
        getErrorMessage(err, "Unable to refresh admin data.")
      );
    } finally {
      setRefreshing(false);
    }
  };

  const openSection = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
    setError("");
    setSuccess("");
  };

  // Service form.
  const handleServiceChange = (event) => {
    const { name, value, type, checked } = event.target;

    setServiceForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add service.
  const addService = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !serviceForm.name.trim() ||
      !serviceForm.category.trim() ||
      !serviceForm.description.trim() ||
      serviceForm.price === ""
    ) {
      setError("Please fill in all service fields.");
      return;
    }

    const price = Number(serviceForm.price);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Service price must be a number greater than 0.");
      return;
    }

    try {
      setAddingService(true);

      const response = await api.post("/services", {
        name: serviceForm.name.trim(),
        category: serviceForm.category.trim(),
        description: serviceForm.description.trim(),
        price,
        available: serviceForm.available,
      });

      if (response.data) {
        setServices((previous) => [...previous, response.data]);
      } else {
        await loadAdminData();
      }

      setServiceForm(emptyServiceForm);
      setSuccess("Service added successfully.");
    } catch (err) {
      console.error("Add service failed:", err);
      setError(getErrorMessage(err, "Unable to add service."));
    } finally {
      setAddingService(false);
    }
  };

  // Delete user.
  const deleteUser = async (userId, userName) => {
    if (Number(userId) === currentUserId) {
      window.alert("You cannot delete your own admin account.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${userName || "this user"}?`
      )
    ) {
      return;
    }

    setDeletingUser(userId);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/admin/users/${userId}`);

      setUsers((previous) =>
        previous.filter((user) => user.id !== userId)
      );

      setSuccess("User deleted successfully.");
    } catch (err) {
      console.error("Delete user failed:", err);
      setError(getErrorMessage(err, "Unable to delete user."));
    } finally {
      setDeletingUser(null);
    }
  };

  // Delete service.
  const deleteService = async (serviceId, serviceName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${serviceName || "this service"}?`
      )
    ) {
      return;
    }

    setDeletingService(serviceId);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/admin/services/${serviceId}`);

      setServices((previous) =>
        previous.filter((service) => service.id !== serviceId)
      );

      setSuccess("Service deleted successfully.");
    } catch (err) {
      console.error("Delete service failed:", err);
      setError(getErrorMessage(err, "Unable to delete service."));
    } finally {
      setDeletingService(null);
    }
  };

  // Open provider deletion popup.
  const openDeletePopup = (provider) => {
    setSelectedProvider(provider);
    setShowDeletePopup(true);
    setError("");
    setSuccess("");
  };

  const closeDeletePopup = () => {
    if (deletingProvider !== null) return;

    setShowDeletePopup(false);
    setSelectedProvider(null);
  };

  // Delete provider and reload persisted booking statuses.
  const confirmDeleteProvider = async () => {
    if (!selectedProvider || deletingProvider !== null) return;

    const providerId = selectedProvider.id;
    const providerName =
      selectedProvider.name ?? selectedProvider.user?.name;

    setDeletingProvider(providerId);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/admin/providers/${providerId}`);

      setProviders((previous) =>
        previous.filter(
          (provider) => Number(provider.id) !== Number(providerId)
        )
      );

      const bookingsResponse = await api.get("/admin/bookings");
      setBookings(asArray(bookingsResponse));

      setShowDeletePopup(false);
      setSelectedProvider(null);

      setSuccess(
        `Provider ${providerName || `#${providerId}`} was deleted successfully. Upcoming unfinished bookings were cancelled.`
      );
    } catch (err) {
      console.error("Delete provider failed:", err);
      setError(getErrorMessage(err, "Unable to delete provider."));
    } finally {
      setDeletingProvider(null);
    }
  };

  // Delete booking.
  const deleteBooking = async (bookingId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete booking #${bookingId}?`
      )
    ) {
      return;
    }

    setDeletingBooking(bookingId);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/admin/bookings/${bookingId}`);

      setBookings((previous) =>
        previous.filter((booking) => booking.id !== bookingId)
      );

      setSuccess("Booking deleted successfully.");
    } catch (err) {
      console.error("Delete booking failed:", err);
      setError(getErrorMessage(err, "Unable to delete booking."));
    } finally {
      setDeletingBooking(null);
    }
  };

  // Logout.
  const logout = () => {
    ["token", "userId", "name", "email", "role"].forEach((key) =>
      sessionStorage.removeItem(key)
    );

    navigate("/login", { replace: true });
  };

  // Dashboard statistics.
  const pendingBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === "PENDING"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === "CONFIRMED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === "COMPLETED"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === "CANCELLED"
  ).length;

  const availableProviders = providers.filter(
    (provider) => provider.available === true
  ).length;

  const busyProviders = providers.length - availableProviders;

  const serviceUsage = bookings.reduce((usage, booking) => {
    const name =
      booking.serviceName ||
      booking.service?.name ||
      "Unknown Service";

    usage[name] = (usage[name] || 0) + 1;
    return usage;
  }, {});

  const popularServices = Object.entries(serviceUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Always show the five newest bookings first.
  const recentBookings = [...bookings]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  const refreshButton = (
    <button
      type="button"
      className="refresh-admin-button"
      onClick={refreshAdminData}
      disabled={refreshing}
    >
      {refreshing ? "Refreshing..." : "↻ Refresh"}
    </button>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-brand">
            <div className="app-logo">
              <img src={logo} alt="Home Service" />
            </div>
            <div>
              <h1>Home Service</h1>
              <p>Loading administrator dashboard...</p>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="app-logo">
            <img src={logo} alt="Home Service" />
          </div>
          <div>
            <h1>Home Service</h1>
            <p>
              Welcome <strong>{sessionStorage.getItem("name") || "Admin"}</strong>
            </p>
            <span className="header-welcome">Administrator Dashboard</span>
          </div>
        </div>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {menuOpen && (
        <div className="provider-sidebar">
          <div className="provider-sidebar-header">
            <div className="provider-sidebar-brand">
              <img src={logo} alt="Home Service" />
              <div>
                <h2>Home Service</h2>
                <p>Admin Menu</p>
              </div>
            </div>

            <button
              className="provider-sidebar-close"
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav className="provider-sidebar-menu">
            {[
              ["dashboard", "Dashboard"],
              ["users", "Users"],
              ["services", "Services"],
              ["providers", "Service Providers"],
              ["bookings", "Bookings"],
            ].map(([section, label]) => (
              <button
                type="button"
                key={section}
                className={activeSection === section ? "active" : ""}
                onClick={() => openSection(section)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="provider-sidebar-footer">
            <button
              type="button"
              className="provider-sidebar-logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" role="status">
          {success}
        </div>
      )}

      {activeSection === "dashboard" && (
        <main className="admin-dashboard-home">
          <section className="admin-dashboard-intro">
            <div>
              <span>ADMINISTRATION</span>
              <h2>Manage Your Home Service Platform</h2>
              <p>
                Monitor users, services, service providers and customer bookings
                from one place.
              </p>
            </div>
          </section>

          <section className="admin-stats">
            <button
              type="button"
              className="admin-stat-card users-card"
              onClick={() => openSection("users")}
            >
              <div className="admin-stat-icon">U</div>
              <div className="admin-stat-content">
                <span>Total Users</span>
                <strong>{users.length}</strong>
                <small>Registered users</small>
              </div>
            </button>

            <button
              type="button"
              className="admin-stat-card services-card"
              onClick={() => openSection("services")}
            >
              <div className="admin-stat-icon">S</div>
              <div className="admin-stat-content">
                <span>Total Services</span>
                <strong>{services.length}</strong>
                <small>Listed services</small>
              </div>
            </button>

            <button
              type="button"
              className="admin-stat-card providers-card"
              onClick={() => openSection("providers")}
            >
              <div className="admin-stat-icon">P</div>
              <div className="admin-stat-content">
                <span>Total Providers</span>
                <strong>{providers.length}</strong>
                <small>Registered professionals</small>
              </div>
            </button>

            <button
              type="button"
              className="admin-stat-card bookings-card"
              onClick={() => openSection("bookings")}
            >
              <div className="admin-stat-icon">B</div>
              <div className="admin-stat-content">
                <span>Total Bookings</span>
                <strong>{bookings.length}</strong>
                <small>Customer bookings</small>
              </div>
            </button>
          </section>

          <div className="admin-dashboard-refresh">{refreshButton}</div>

          <section className="admin-dashboard-grid">
            {/* RECENT BOOKINGS */}
            <div className="admin-dashboard-panel recent-bookings-panel">
              <div className="admin-panel-header">
                <div>
                  <span>ACTIVITY</span>
                  <h3>Recent Bookings</h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSection("bookings")}
                >
                  View All
                </button>
              </div>

              {recentBookings.length === 0 ? (
                <div className="admin-empty-state">
                  No bookings available.
                </div>
              ) : (
                <div className="recent-bookings-list">
                  {recentBookings.map((booking) => (
                    <div className="recent-booking-item" key={booking.id}>
                      <div className="recent-booking-number">
                        #{booking.id}
                      </div>

                      <div className="recent-booking-info">
                        <strong>
                          {booking.serviceName ||
                            booking.service?.name ||
                            "Service"}
                        </strong>
                        <span>
                          {booking.customerName ||
                            booking.customer?.name ||
                            "Customer"}
                          {" • "}
                          {booking.providerName ||
                            booking.provider?.name ||
                            (booking.cancellationMessage
                              ? "Provider unavailable"
                              : "Provider")}
                        </span>
                      </div>

                      <div className="recent-booking-status">
                        {booking.status || "Pending"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOOKING STATUS */}
            <div className="admin-dashboard-panel">
              <div className="admin-panel-header">
                <div>
                  <span>BOOKINGS</span>
                  <h3>Booking Status</h3>
                </div>
              </div>

              <div className="status-overview">
                <div className="status-row">
                  <span>Pending</span>
                  <strong>{pendingBookings}</strong>
                </div>
                <div className="status-row">
                  <span>Confirmed</span>
                  <strong>{confirmedBookings}</strong>
                </div>
                <div className="status-row">
                  <span>Completed</span>
                  <strong>{completedBookings}</strong>
                </div>
                <div className="status-row">
                  <span>Cancelled</span>
                  <strong>{cancelledBookings}</strong>
                </div>
              </div>
            </div>

            {/* PROVIDER OVERVIEW */}
            <div className="admin-dashboard-panel">
              <div className="admin-panel-header">
                <div>
                  <span>PROVIDERS</span>
                  <h3>Provider Overview</h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSection("providers")}
                >
                  View
                </button>
              </div>

              <div className="provider-overview">
                <div className="provider-overview-card">
                  <span>Available</span>
                  <strong>{availableProviders}</strong>
                </div>
                <div className="provider-overview-card">
                  <span>Busy / Unavailable</span>
                  <strong>{busyProviders}</strong>
                </div>
                <div className="provider-overview-card">
                  <span>Total</span>
                  <strong>{providers.length}</strong>
                </div>
              </div>
            </div>

            {/* POPULAR SERVICES */}
            <div className="admin-dashboard-panel">
              <div className="admin-panel-header">
                <div>
                  <span>SERVICES</span>
                  <h3>Popular Services</h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSection("services")}
                >
                  View
                </button>
              </div>

              {popularServices.length === 0 ? (
                <div className="admin-empty-state">
                  No service booking data available.
                </div>
              ) : (
                <div className="popular-services-list">
                  {popularServices.map(([name, count]) => (
                    <div className="popular-service-row" key={name}>
                      <span>{name}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* USERS */}
      {activeSection === "users" && (
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Users</h2>
            {refreshButton}
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{display(user.id)}</td>
                      <td>{display(user.name)}</td>
                      <td>{display(user.email)}</td>
                      <td>{display(user.phone)}</td>
                      <td>{display(user.role)}</td>
                      <td>
                        {Number(user.id) === currentUserId ? (
                          <span className="admin-current-user">
                            Current Admin
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="admin-delete-button"
                            disabled={deletingUser === user.id}
                            onClick={() => deleteUser(user.id, user.name)}
                          >
                            {deletingUser === user.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SERVICES */}
      {activeSection === "services" && (
        <>
          <section className="admin-section">
            <h2>Add New Service</h2>

            <form className="admin-service-form" onSubmit={addService}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="service-name">Service Name</label>
                  <input
                    id="service-name"
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleServiceChange}
                    placeholder="Example: Plumbing"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="service-category">Category</label>
                  <input
                    id="service-category"
                    type="text"
                    name="category"
                    value={serviceForm.category}
                    onChange={handleServiceChange}
                    placeholder="Example: Plumbing"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="service-description">Description</label>
                  <textarea
                    id="service-description"
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceChange}
                    placeholder="Enter service description"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="service-price">Price (₹)</label>
                  <input
                    id="service-price"
                    type="number"
                    name="price"
                    min="0.01"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={handleServiceChange}
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group admin-service-availability">
                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={serviceForm.available}
                    onChange={handleServiceChange}
                  />
                  Available for booking
                </label>
              </div>

              <button
                type="submit"
                className="admin-add-button"
                disabled={addingService}
              >
                {addingService ? "Adding..." : "Add Service"}
              </button>
            </form>
          </section>

          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Services</h2>
              {refreshButton}
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="7">No services found.</td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id}>
                        <td>{display(service.id)}</td>
                        <td>{display(service.name)}</td>
                        <td>{display(service.category)}</td>
                        <td>{display(service.description)}</td>
                        <td>₹{display(service.price, "0")}</td>
                        <td>{service.available ? "Yes" : "No"}</td>
                        <td>
                          <button
                            type="button"
                            className="admin-delete-button"
                            disabled={deletingService === service.id}
                            onClick={() =>
                              deleteService(service.id, service.name)
                            }
                          >
                            {deletingService === service.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* SERVICE PROVIDERS */}
      {activeSection === "providers" && (
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Service Providers</h2>
            {refreshButton}
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Service Area</th>
                  <th>Available</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan="9">No providers found.</td>
                  </tr>
                ) : (
                  providers.map((provider) => (
                    <tr key={provider.id}>
                      <td>{display(provider.id)}</td>
                      <td>{display(provider.userId ?? provider.user?.id)}</td>
                      <td>{display(provider.name ?? provider.user?.name)}</td>
                      <td>{display(provider.specialization)}</td>
                      <td>{display(provider.experience)}</td>
                      <td>{display(provider.serviceArea)}</td>
                      <td>{provider.available ? "Yes" : "No"}</td>
                      <td>{display(provider.rating, "Not rated")}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-delete-button"
                          disabled={deletingProvider === provider.id}
                          onClick={() => openDeletePopup(provider)}
                        >
                          {deletingProvider === provider.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* BOOKINGS */}
      {activeSection === "bookings" && (
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Bookings</h2>
            {refreshButton}
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="10">No bookings found.</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{display(booking.id)}</td>
                      <td>
                        {display(
                          booking.customerName ?? booking.customer?.name
                        )}
                      </td>
                      <td>
                        {display(
                          booking.serviceName ?? booking.service?.name
                        )}
                      </td>
                      <td>
                        {display(
                          booking.providerName ?? booking.provider?.name,
                          booking.cancellationMessage
                            ? "Provider unavailable"
                            : "-"
                        )}
                      </td>
                      <td>{display(booking.bookingDate ?? booking.date)}</td>
                      <td>{display(booking.bookingTime ?? booking.time)}</td>
                      <td>{display(booking.address)}</td>
                      <td>₹{display(booking.totalPrice ?? booking.price, "0")}</td>
                      <td>{display(booking.status, "PENDING")}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-delete-button"
                          disabled={deletingBooking === booking.id}
                          onClick={() => deleteBooking(booking.id)}
                        >
                          {deletingBooking === booking.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PROVIDER DELETE CONFIRMATION */}
      <style>{`
        .admin-delete-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.62);
          backdrop-filter: blur(3px);
        }

        .admin-delete-modal {
          width: 100%;
          max-width: 470px;
          padding: 28px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
          animation: adminDeleteModalIn 160ms ease-out;
        }

        .admin-delete-modal-icon {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          margin-bottom: 16px;
          border-radius: 50%;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 26px;
          font-weight: 800;
        }

        .admin-delete-modal h2 {
          margin: 0 0 14px;
          color: #163b65;
          font-size: 23px;
        }

        .admin-delete-modal p {
          margin: 0 0 12px;
          color: #475569;
          line-height: 1.6;
        }

        .admin-delete-modal p strong {
          color: #0f172a;
        }

        .admin-delete-modal .admin-delete-modal-warning {
          padding: 12px 14px;
          border-radius: 8px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 14px;
        }

        .admin-delete-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .admin-delete-modal-actions button {
          padding: 11px 18px;
          border: 0;
          border-radius: 8px;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          transition: background 120ms ease, transform 120ms ease;
        }

        .admin-delete-cancel-button {
          background: #e2e8f0;
          color: #1e293b;
        }

        .admin-delete-cancel-button:hover:not(:disabled) {
          background: #cbd5e1;
        }

        .admin-delete-confirm-button {
          background: #dc2626;
          color: #ffffff;
        }

        .admin-delete-confirm-button:hover:not(:disabled) {
          background: #b91c1c;
        }

        .admin-delete-modal-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes adminDeleteModalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .admin-delete-modal {
            padding: 22px;
          }

          .admin-delete-modal-actions {
            flex-direction: column-reverse;
          }

          .admin-delete-modal-actions button {
            width: 100%;
          }
        }
      `}</style>

      {showDeletePopup && selectedProvider && (
        <div
          className="admin-delete-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeletePopup();
            }
          }}
        >
          <div
            className="admin-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="provider-delete-title"
          >
            <div className="admin-delete-modal-icon" aria-hidden="true">
              !
            </div>

            <h2 id="provider-delete-title">
              Confirm Provider Deletion
            </h2>

            <p>
              Are you sure you want to permanently delete{" "}
              <strong>
                {selectedProvider.name ??
                  selectedProvider.user?.name ??
                  "this provider"}
              </strong>
              ?
            </p>

            <p className="admin-delete-modal-warning">
              Upcoming unfinished bookings will be cancelled. Existing booking
              records and reviews will be retained. This action cannot be undone.
            </p>

            <div className="admin-delete-modal-actions">
              <button
                type="button"
                className="admin-delete-cancel-button"
                onClick={closeDeletePopup}
                disabled={deletingProvider !== null}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-delete-confirm-button"
                onClick={confirmDeleteProvider}
                disabled={deletingProvider !== null}
              >
                {deletingProvider !== null
                  ? "Deleting..."
                  : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
