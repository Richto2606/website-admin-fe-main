import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.asramaputrakukar.my.id/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': '881182541952993820593968'
  }
});

// Interceptor: Menambahkan token secara otomatis ke setiap request
api.interceptors.request.use((config) => {
  // Ambil token dari cookie
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)TOKEN_AUTH\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;