'use client';

import { chartIncomeData, chartOutcomeData, StaticData } from '@interfaces/data-types';
import { getKamarTerpakai, getPemasukanBulanan, getPengeluaranBulanan, getResidentActive, getSinkronisasiPayment } from '@services/dashboard';
import { useState, useCallback } from 'react';

export function useQueryClient() {
  const [isLoading, setIsLoading] = useState(false);

  const activeResidents = useCallback(async (
    onSuccess?: () => void,
    signal?: AbortSignal
  ) : Promise<StaticData | null> => {
    setIsLoading(true);

    try {
      const response = await getResidentActive(signal);
      if (response?.success && response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      } else {
        return null; 
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.response?.status !== 401) {
        console.error(err);
      }
      return null; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const kamarTerpakai = useCallback(async (
    onSuccess?: () => void,
    signal?: AbortSignal
  ) : Promise<StaticData | null> => {
    setIsLoading(true);

    try {
      const response = await getKamarTerpakai(signal);
      if (response?.success && response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      } else {
        return null; 
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.response?.status !== 401) {
        console.error(err);
      }
      return null; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pemasukanBulanan = useCallback(async (
    bulan: number, 
    onSuccess?: () => void,
    signal?: AbortSignal
  ) : Promise<chartIncomeData | null> => {
    setIsLoading(true);

    try {
      const response = await getPemasukanBulanan(bulan, signal);
      if (response?.success && response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      } else {
        return null; 
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.response?.status !== 401) {
        console.error(err);
      }
      return null; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pengeluranBulanan = useCallback(async (
    bulan: number, 
    onSuccess?: () => void,
    signal?: AbortSignal
  ) : Promise<chartOutcomeData | null> => {
    setIsLoading(true);

    try {
      const response = await getPengeluaranBulanan(bulan, signal);
      if (response?.success && response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      } else {
        return null; 
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.response?.status !== 401) {
        console.error(err);
      }
      return null; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sinkronisasiPayment = useCallback(async (
    onSuccess?: () => void,
    signal?: AbortSignal
  ) : Promise<StaticData | null> => {
    setIsLoading(true);

    try {
      const response = await getSinkronisasiPayment(signal);
      if (response?.success && response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      } else {
        return null; 
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.response?.status !== 401) {
        console.error(err);
      }
      return null; 
    } finally {
      setIsLoading(false);
    }
  }, []);
  return {
    isLoading,
    activeResidents,
    kamarTerpakai,
    pemasukanBulanan,
    pengeluranBulanan,
    sinkronisasiPayment
  };
}
