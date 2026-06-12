import { refreshAccessToken } from "@services/auth/01-auth";
import { getCookiesStore } from "@store/cookiesStore";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Variabel untuk menangani refresh token agar tidak terjadi race condition
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const SatellitePrivate: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_BASE_URL_API || 'https://api.asramaputrakukar.my.id/api/v1',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": process.env.NEXT_API_KEY || '881182541952993820593968',
  },
});

SatellitePrivate.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getCookiesStore();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token in request interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

SatellitePrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized) dan belum dicoba ulang
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang refresh, masukkan ke antrian
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return SatellitePrivate(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const oldToken = await getCookiesStore();
        if (oldToken) {
          const newToken = await refreshAccessToken(oldToken);
          if (newToken) {
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return SatellitePrivate(originalRequest);
          }
        }
        
        // Jika tidak ada token lama atau refresh gagal
        processQueue(new Error("Refresh token failed"), null);
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default SatellitePrivate;
