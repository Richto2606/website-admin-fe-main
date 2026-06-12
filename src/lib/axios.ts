import axios from 'axios';

const api = axios.create({
  // Gunakan process.env.NEXT_PUBLIC_ untuk Next.js
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '881182541952993820593968'
  }
});

// Interceptor: Menambahkan token secara otomatis ke setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari cookie dengan regex yang lebih aman
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('TOKEN_AUTH='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;