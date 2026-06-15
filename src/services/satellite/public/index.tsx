import { formatMessage } from "@interfaces/data-types";
import axios, { AxiosResponse } from "axios";

const SatellitePublic = axios.create({
  baseURL: 'https://asramaputrakukar.my.id/api/v1',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || 'base64:ATExanwKx0EoEeEsVSFlOhELX/PoEuPKqWkBu3yTEUo=', 
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
