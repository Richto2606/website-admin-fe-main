import { useState } from 'react';
import { ResidentAddForm, Resident, ResidentEditForm } from '@interfaces/data-types';
import { useToast } from '@interfaces/use-toast';
import { 
  postResident,
  getByIdResident,
  putResident, 
} from '@services/resident';

// ✅ TAMBAHKAN INI (URL yang benar)
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const API_KEY = '881182541952993820593968';

export function useQueryClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);

  // ==============================================
  // 🔥 GET ALL RESIDENTS
  // ==============================================
  const getAllResidents = async (params?: {
    name?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
  }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (params?.name) queryParams.append('name', params.name);
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      
      // ✅ PERBAIKI URL
      const url = `${API_BASE_URL}/residents?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': API_KEY
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResidents(result.data);
        return {
          success: true,
          data: result.data,
          pagination: {
            count: result.count,
            current_page: result.current_page,
            total_pages: result.total_pages
          }
        };
      } else {
        toast({
          variant: 'failed',
          title: 'Error',
          description: result.message || 'Gagal mengambil data penghuni',
        });
        return { success: false, data: [] };
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'failed',
        title: 'Error',
        description: 'Terjadi kesalahan saat mengambil data penghuni',
      });
      return { success: false, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 GET RESIDENT BY USER ID
  // ==============================================
  const getResidentByUserId = async (userId: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // ✅ PERBAIKI URL
      const response = await fetch(
        `${API_BASE_URL}/residents/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-API-KEY': API_KEY
          }
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        return { success: false, data: null };
      }
    } catch (err) {
      console.error(err);
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 CREATE RESIDENT FROM PENDAFTARAN
  // ==============================================
  const createResidentFromPendaftaran = async (formData: {
    user_id: number;
    name: string;
    phone_number?: string;
    address?: string;
    status?: string;
  }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // ✅ PERBAIKI URL
      const response = await fetch(
        `${API_BASE_URL}/residents/from-pendaftaran`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-API-KEY': API_KEY
          },
          body: JSON.stringify({
            user_id: formData.user_id,
            name: formData.name,
            phone_number: formData.phone_number || '',
            address: formData.address || '',
            status: formData.status || 'Aktif'
          })
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Data penghuni berhasil ditambahkan dari pendaftaran',
        });
        return { success: true, data: result.data };
      } else {
        toast({
          variant: 'failed',
          title: 'Error',
          description: result.message || 'Gagal menambahkan penghuni',
        });
        return { success: false, data: null };
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'failed',
        title: 'Error',
        description: 'Terjadi kesalahan saat menambahkan penghuni',
      });
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 UPDATE RESIDENT FROM PENDAFTARAN
  // ==============================================
  const updateResidentFromPendaftaran = async (
    id: string,
    formData: {
      name?: string;
      phone_number?: string;
      address?: string;
      status?: string;
      tanggal_masuk?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // ✅ PERBAIKI URL
      const response = await fetch(
        `${API_BASE_URL}/residents/${id}/from-pendaftaran`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-API-KEY': API_KEY
          },
          body: JSON.stringify(formData)
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Data penghuni berhasil diperbarui',
        });
        return { success: true, data: result.data };
      } else {
        toast({
          variant: 'failed',
          title: 'Error',
          description: result.message || 'Gagal memperbarui penghuni',
        });
        return { success: false, data: null };
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'failed',
        title: 'Error',
        description: 'Terjadi kesalahan saat memperbarui penghuni',
      });
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 CREATE RESIDENT (SUDAH ADA)
  // ==============================================
  const createResident = async (formData: ResidentAddForm, onSuccess?: () => void) => {
    setIsLoading(true);

    try {
      const response = await postResident(formData);
      if (response.status) {
        toast({
          variant: 'success',
          title: 'Success',
          description: response.message,
        });
        if (onSuccess) onSuccess();
      } else {
        console.error(response);
        toast({
          variant: 'failed',
          title: 'Error',
          description: response.message || 'An error occurred while creating the resident.',
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'failed',
        title: 'Error',
        description: 'Something went wrong, please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 DETAIL RESIDENT (SUDAH ADA)
  // ==============================================
  const detailResident = async (
    id: string | number, 
    onSuccess?: () => void
  ) : Promise<Resident | null> => {
    setIsLoading(true);

    try {
      const response = await getByIdResident(id);
      if (response?.success && response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      } else {
        return null; 
      }
    } catch (err) {
      console.error(err);
      return null; 
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 UPDATE RESIDENT (SUDAH ADA)
  // ==============================================
  const updateResident = async (formData: ResidentEditForm, id: string | number, onSuccess?: () => void) => {
    setIsLoading(true);

    try {
      const response = await putResident(formData, id);
      if (response.status) {
        toast({
          variant: 'success',
          title: 'Success',
          description: response.message,
        });
        if (onSuccess) onSuccess();
      } else {
        console.error(response);
        toast({
          variant: 'failed',
          title: 'Error',
          description: response.message || 'An error occurred while updating the resident.',
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'failed',
        title: 'Error',
        description: 'Something went wrong, please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // 🔥 REFRESH DATA
  // ==============================================
  const refreshResidents = async () => {
    return await getAllResidents();
  };

  return {
    isLoading,
    residents,
    getAllResidents,
    getResidentByUserId,
    createResidentFromPendaftaran,
    updateResidentFromPendaftaran,
    refreshResidents,
    createResident,
    detailResident,
    updateResident
  };
}