import { formatMessage } from "@interfaces/data-types";
import axios, { AxiosResponse } from "axios";

// ✅ PERBAIKI URL
const SatellitePublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || '881182541952993820593968',
  },
});

SatellitePublic.interceptors.response.use(
  (response: AxiosResponse<formatMessage>) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default SatellitePublic;