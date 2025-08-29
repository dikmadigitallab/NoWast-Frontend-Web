import axios from "axios";

const api = axios.create({
    baseURL:'https://nowastev2.api.dikmadigital.com.br/'//process.env.NEXT_PUBLIC_API_URL,
});

export default api;
