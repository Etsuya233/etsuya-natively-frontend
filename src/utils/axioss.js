import axios from "axios";

const axioss = axios.create({
    baseURL: '/api',
});

export default axioss;