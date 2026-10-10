import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerBookings from "./pages/CustomerBookings";

import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderAbout from "./pages/ProviderAbout";
import ProviderContact from "./pages/ProviderContact";
import ProviderSettings from "./pages/ProviderSettings";

import AdminDashboard from "./pages/AdminDashboard";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";

import BookingForm from "./components/BookingForm";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= AUTH ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* ================= CUSTOMER ================= */}

                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute allowedRole="CUSTOMER">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/bookings"
                    element={
                        <ProtectedRoute allowedRole="CUSTOMER">
                            <CustomerBookings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/book-service/:serviceId"
                    element={
                        <ProtectedRoute allowedRole="CUSTOMER">
                            <BookingForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/about"
                    element={
                        <ProtectedRoute allowedRole="CUSTOMER">
                            <About />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/contact"
                    element={
                        <ProtectedRoute allowedRole="CUSTOMER">
                            <Contact />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/settings"
                    element={
                        <ProtectedRoute allowedRole="CUSTOMER">
                            <Settings />
                        </ProtectedRoute>
                    }
                />


                {/* ================= PROVIDER ================= */}

                <Route
                    path="/provider"
                    element={
                        <ProtectedRoute allowedRole="SERVICE_PROVIDER">
                            <ProviderDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/provider/about"
                    element={
                        <ProtectedRoute allowedRole="SERVICE_PROVIDER">
                            <ProviderAbout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/provider/contact"
                    element={
                        <ProtectedRoute allowedRole="SERVICE_PROVIDER">
                            <ProviderContact />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/provider/settings"
                    element={
                        <ProtectedRoute allowedRole="SERVICE_PROVIDER">
                            <ProviderSettings />
                        </ProtectedRoute>
                    }
                />


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;