import axios from 'axios';
import FormData from 'form-data';
const config = useRuntimeConfig()

export const useUtils = () => {

  const getBackendUrl = async () => {
    const myUrl = await axios.get('/api/settings/connectBackend');
    return myUrl.data
  }

  const formatCurImageUrl = (serverURI: string ,asset: string) => {
    const combi = serverURI+asset;
    return combi;    
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    try {
      const result = await axios.post(`${config.public.apiBase}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(result){
        return result.data;
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  };

  const uploadUpdateImage = async (file) => {
    console.log('[composables][uploadUpdateImage] Start Upload');
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axios.post(`${config.public.apiBase}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${config.public.apiToken}`
        }
      });
      if(response){
        console.log('[composables][uploadUpdateImage] Upload Success')
        console.log(response);
        return response.data;
      }
      
    } catch(error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  };

  const getImageServerUrl = async () => {
    const myUrl = await axios.get('/api/settings/currentDeviceIp');
    return myUrl.data
  }

  return {
    getBackendUrl,
    formatCurImageUrl,
    uploadImage,
    uploadUpdateImage,
    getImageServerUrl
  }
}
