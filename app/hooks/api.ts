import axios from "axios";

const api = axios.create({
    baseURL: "http://189.50.3.3:3308",
    // baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;
