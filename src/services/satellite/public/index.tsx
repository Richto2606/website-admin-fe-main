import { formatMessage } from "@interfaces/data-types";
import axios, { AxiosResponse } from "axios";

const SatellitePublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asramaputrakukar.my.id/api/v1',
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
