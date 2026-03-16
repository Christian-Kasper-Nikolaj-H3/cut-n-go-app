const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not defined in environment variables");
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized", response = null) {
        super(message);
        this.name = "UnauthorizedError";
        this.response = response;
    }
}

export const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Lad komponenten/caller beslutte hvad der skal ske
        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized", response);
        }

        return response;
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            throw err;
        }
        throw new Error(`Network error: ${err.message}`);
    }
};