import { chartIncomeData, chartOutcomeData, formatMessage, StaticData} from '@interfaces/data-types';
import SatellitePrivate from '@services/satellite/private';
import { AxiosRequestConfig } from 'axios';

export async function getResidentActive(signal?: AbortSignal): Promise<formatMessage<StaticData>> {
  try {
    const config: AxiosRequestConfig = signal ? { signal } : {};
    const res = await SatellitePrivate.get<formatMessage<StaticData>>('/residents/grafik/active', config);
    return  res.data;
  } catch (error: any) {
    if (error.name !== 'CanceledError' && error.response?.status !== 401) {
      console.error('Error fetching datas:', error);
    }
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred.',
      data: null,
    };
  }
}

export async function getKamarTerpakai(signal?: AbortSignal): Promise<formatMessage<StaticData>> {
  try {
    const config: AxiosRequestConfig = signal ? { signal } : {};
    const res = await SatellitePrivate.get<formatMessage<StaticData>>('/rooms/grafik/occupied', config);
    return  res.data;
  } catch (error: any) {
    if (error.name !== 'CanceledError' && error.response?.status !== 401) {
      console.error('Error fetching datas:', error);
    }
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred.',
      data: null,
    };
  }
}

export async function getPemasukanBulanan(bulan: number, signal?: AbortSignal): Promise<formatMessage<chartIncomeData>> {
  try {
    const config: AxiosRequestConfig = signal ? { signal } : {};
    const res = await SatellitePrivate.get<formatMessage<chartIncomeData>>(`/income/grafik/${bulan}`, config);
    return  res.data;
  } catch (error: any) {
    if (error.name !== 'CanceledError' && error.response?.status !== 401) {
      console.error('Error fetching datas:', error);
    }
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred.',
      data: null,
    };
  }
}

export async function getPengeluaranBulanan(bulan: number, signal?: AbortSignal): Promise<formatMessage<chartOutcomeData>> {
  try {
    const config: AxiosRequestConfig = signal ? { signal } : {};
    const res = await SatellitePrivate.get<formatMessage<chartOutcomeData>>(`/outcome/grafik/${bulan}`, config);
    return  res.data;
  } catch (error: any) {
    if (error.name !== 'CanceledError' && error.response?.status !== 401) {
      console.error('Error fetching datas:', error);
    }
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred.',
      data: null,
    };
  }
}

export async function getSinkronisasiPayment(signal?: AbortSignal): Promise<formatMessage<StaticData>> {
  try {
    const config: AxiosRequestConfig = signal ? { signal } : {};
    const res = await SatellitePrivate.get<formatMessage<StaticData>>('/payments/grafik/sync', config);
    return  res.data;
  } catch (error: any) {
    if (error.name !== 'CanceledError' && error.response?.status !== 401) {
      console.error('Error fetching datas:', error);
    }
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred.',
      data: null,
    };
  }
}