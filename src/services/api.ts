import axios from "axios";

const API = axios.create({
    baseURL: "http://51.21.136.94:3000/api", 
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