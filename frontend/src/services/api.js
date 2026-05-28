import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const getSalons = (params) => API.get('/salons', {params});
export const getSalonById = (id) => API.get(`/salons/${id}`);
export const updateSalon = (id, data) => API.put(`/salons/${id}`, data);
export const updateSalonsData = () => API.post('/salons/update');

export default API;