import axios from 'axios';
import FormData from 'form-data';
//import * as dotenv from 'dotenv'
//dotenv.config()
const config = useRuntimeConfig()

export const useUseUpload = () => {
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    //console.log(formData);
    //console.log(config.apiBase)
    // console.log("publicid: ", file.publicid);
    // console.log("Firstname: ", file.firstname);
    // console.log("image_name: ", file.image.name);

    try {
      const response = await axios.post(`${config.public.apiBase}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${config.public.apiToken}`
        }
      });
      //console.log("Response: ", response.data);
      return response.data;

    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  }
  return {
    uploadImage,
  }
}
