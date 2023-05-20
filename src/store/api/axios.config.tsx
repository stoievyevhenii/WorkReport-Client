import axios from 'axios';

export const axiosConfig = axios.create({
    baseURL: 'https://localhost:7040/',
    headers: {
        "Content-Type": "application/json",
    },

});

axiosConfig.interceptors.request.use((req) => {
    if (sessionStorage.getItem("token")) {
        const token = sessionStorage.getItem("token");
        req.headers["Authorization"] = `Bearer ${token || ""}`;
        return req;
    }
    return req;
});