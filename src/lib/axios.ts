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
    let token = null;

    // Pengecekan krusial: Pastikan ini berjalan di browser, bukan di server Next.js
    if (typeof window !== 'undefined') {
      // Cara paling tangguh dan aman membaca cookie menggunakan Regex
      const match = document.cookie.match(new RegExp('(^| )TOKEN_AUTH=([^;]+)'));
      token = match ? decodeURIComponent(match[2]) : null;
      
      // Pelacak untuk mengecek apakah token berhasil dibaca oleh Axios di console browser
      // (Bisa dihapus jika aplikasi sudah mau masuk tahap produksi)
      console.log("Status Token di Axios:", token ? "TERBACA" : "KOSONG");
    }

    // Jika token ada, sisipkan ke header Authorization
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