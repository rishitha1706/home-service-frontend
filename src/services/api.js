
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        const url = config.url || "";
        const method = (config.method || "get").toLowerCase();

        // Public endpoints should not receive an old JWT.
        const isLoginOrAuth =
            url.startsWith("/auth/") ||
            url.startsWith("auth/");

        const isRegistration =
            method === "post" &&
            (url === "/users" || url === "users");

        if (isLoginOrAuth || isRegistration) {
            if (config.headers) {
                delete config.headers.Authorization;
                delete config.headers.authorization;
            }

            return config;
        }

        // Attach JWT only to requests that may need authentication.
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
