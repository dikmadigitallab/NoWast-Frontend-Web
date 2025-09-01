import axios from "axios";

const api = axios.create({
    baseURL:/* process.env.NEXT_PUBLIC_API_URL|| */'https://nowastev2.api.dikmadigital.com.br',
     // withCredentials: true, // garante envio de cookies
      
});



export default api;
