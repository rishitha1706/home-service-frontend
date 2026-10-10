import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {

    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    // Not logged in
    if (!token || !role) {
        return <Navigate to="/login" replace />;
    }

    // Convert single role or multiple roles into an array
    const allowedRoles = Array.isArray(allowedRole)
        ? allowedRole
        : [allowedRole];

    // Logged in but wrong role
    if (!allowedRoles.includes(role)) {

        if (role === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        if (role === "SERVICE_PROVIDER") {
            return <Navigate to="/provider" replace />;
        }

        if (role === "CUSTOMER") {
            return <Navigate to="/customer" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;