import axios from 'axios';

const api = axios.create({
  // Gunakan process.env.NEXT_PUBLIC_ untuk Next.js
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asramaputrakukar.my.id/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '881182541952993820593968'
  }
});

// Interceptor: Menambahkan token secara otomatis ke setiap request
api.interceptors.request.use(
  (config) => {
    // Cara paling tangguh dan aman membaca cookie menggunakan Regex
    const match = document.cookie.match(new RegExp('(^| )TOKEN_AUTH=([^;]+)'));
    const token = match ? decodeURIComponent(match[2]) : null;
    
    // Pelacak untuk mengecek apakah token berhasil dibaca oleh Axios di console browser
    console.log("Status Token di Axios:", token ? "TERBACA" : "KOSONG");

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