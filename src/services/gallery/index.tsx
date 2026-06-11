import { formatMessage, Gallery, GalleryAddForm, GalleryEditForm } from '@interfaces/data-types';
import SatellitePrivate from '@services/satellite/private';
import axios, { AxiosError } from 'axios';

export async function postGallery(formData: GalleryAddForm) {
  try {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("type", formData.type);
    payload.append("category_id", formData.category_id);
    if(formData.type == 'Foto' && formData.file != null){
      payload.append("file", formData.file);
    }
    if(formData.type == 'Video' && formData.url != null){
      payload.append("url", formData.url);
    }
    console.log(formData.file)
    const res = await SatellitePrivate.post<formatMessage<Gallery>>(
      '/galleries', payload ,
      {
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    const response =  res.data;
    return {
      status: response.success,
      message: response.message,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'An error occurred.';
      return {
        status: false,
        message: message || 'Unexpected server error.',
      };
    } else {
      console.error('Unexpected error:', error);
      return {
        status: false,
        message: 'An unexpected error occurred.',
      };
    }
  }
}

export async function getByIdGallery(id: string | number): Promise<formatMessage<Gallery>> {
  try {
    const res = await SatellitePrivate.get<formatMessage<Gallery>>(`/galleries/${id}`);
    const response = res.data;

    if (response.success && response.data) {
      if(response.data.type === "Foto"){
        try {
          const responseFile = await SatellitePrivate.get(`/galleries/get-file/${id}`, { responseType: 'blob' });

          if (responseFile.status === 200) {
            const blob = responseFile.data;
            const contentType = responseFile.headers['content-type'];
            const fileName = response.data.file_name || 'unknown';
            const file = new File([blob], fileName, { type: contentType });

            response.data.file_gallery = file;
          } else {
            console.error('Failed to fetch the file. Status code:', responseFile.status);
            response.data.file_gallery = undefined;
          }
        } catch (fileError) {
          console.error('Error fetching gallery file:', fileError);
          response.data.file_gallery = undefined;
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return {
      success: false,
      message: 'An unexpected error occurred.',
      data: null,
    };
  }
}

export async function putGallery(formData: GalleryEditForm, id: string | number) {
  try {
    const payload = new FormData();
    payload.append("_method", "PUT");
    payload.append("title", formData.title);
    payload.append("type", formData.type);
    payload.append("category_id", formData.category_id);
    if(formData.type == 'Foto' && formData.file != null){
      payload.append("file", formData.file);
    }
    if(formData.type == 'Video' && formData.url != null){
      payload.append("url", formData.url);
    }
    const res = await SatellitePrivate.post<formatMessage<null>>(
      `/galleries/${id}`, payload ,
      {
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    const response =  res.data;
    return {
      status: response.success,
      message: response.message,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'An error occurred.';
      return {
        status: false,
        message: message || 'Unexpected server error.',
      };
    } else {
      console.error('Unexpected error:', error);
      return {
        status: false,
        message: 'An unexpected error occurred.',
      };
    }
  }
}

export async function deleteGallery(id: string | number) {
  try {
    const res = await SatellitePrivate.delete<any>(
      `/galleries/${id}`
    );
    
    // Periksa apakah HTTP status sukses DAN isi respon juga menyatakan sukses
    const isSuccess = (res.status >= 200 && res.status < 300) && 
                      (res.data?.success !== false && res.data?.status !== false);

    return {
      status: isSuccess,
      message: res.data?.message || (isSuccess ? 'Media berhasil dihapus' : 'Gagal menghapus media'),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      return {
        status: false,
        message: axiosError.response?.data?.message || axiosError.message || 'Gagal menghapus media (Server Error)',
      };
    }
    return {
      status: false,
      message: 'Gagal menghapus media (Unexpected Error)',
    };
  }
}