import axios from 'axios';
import FormData from 'form-data';
const config = useRuntimeConfig()

export const useUseUpdateUpload = () => {
  const uploadUpdateImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axios.post(`${config.public.apiBase}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${config.public.apiToken}`
        }
      });

      return response.data;
    } catch(error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  }

  return {
    uploadUpdateImage
  }
}
