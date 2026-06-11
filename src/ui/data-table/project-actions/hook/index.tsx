import { useState } from 'react';
import { useToast } from '@interfaces/use-toast';
import { galleryUrl, paymentUrl, reportUrl, residentUrl } from '@constant/breadcrumbs';
import { deleteResident } from '@services/resident';
import { deleteGallery } from '@services/gallery';
import { deletePayment } from '@services/payment';
import { deleteReport } from '@services/report';

export function useQueryClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deleteQuery = async (
    id: string | number, 
    path: string,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    console.log(`Attempting to delete: path=${path}, id=${id}`);

    try {
      let response = {
        status: false,
        message: "Proses hapus gagal: Path tidak valid."
      };
      
      if(path === residentUrl){
        response = await deleteResident(id);
      }else if(path === galleryUrl){
        response = await deleteGallery(id);
      }else if(path === paymentUrl){
        response = await deletePayment(id);
      }else if(path === reportUrl){
        response = await deleteReport(id);
      } else {
        console.error(`Unknown delete path: ${path}`);
      }

      if (response && response.status === true) {
        toast({
          variant: 'success',
          title: 'Success',
          description: response.message || 'Data berhasil dihapus.',
        });
        if (onSuccess) onSuccess();
      } else {
        const errorInfo = {
          path: path,
          id: id,
          response: response,
          timestamp: new Date().toISOString()
        };
        console.error("DEBUG: Delete Failed Detailed Info ->", JSON.stringify(errorInfo, null, 2));
        
        toast({
          variant: 'failed',
          title: 'Error',
          description: response?.message || 'Gagal menghapus data. Silakan coba lagi.',
        });
      }
    } catch (err) {
      console.error("Delete query exception:", err);
      toast({
        variant: 'failed',
        title: 'Error',
        description: 'Something went wrong, please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteQuery
  };
}
