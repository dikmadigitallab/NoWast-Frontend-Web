import axios from "axios";

const api = axios.create({
    baseURL: 'https://nowastev2.api.dikmadigital.com.br/'
    //baseURL: 'http://189.50.3.3:3308/'
    //process.env.NEXT_PUBLIC_API_URL
});

export default api;
