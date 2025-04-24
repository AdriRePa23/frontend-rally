import axios from "axios";

const API = axios.create({
    baseURL: "https://backend-rally-production.up.railway.app/api", 
});

// Agregar token de autenticación a las solicitudes
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;