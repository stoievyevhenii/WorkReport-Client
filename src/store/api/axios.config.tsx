import axios from 'axios';

export const axiosConfig = axios.create({
  baseURL: 'https://server.stoievservices.de/workreport/',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosConfig.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    req.headers['Authorization'] = `Bearer ${token || ''}`;
    return req;
  }
  return req;
});
