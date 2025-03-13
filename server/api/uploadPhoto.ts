import FormData from "form-data";
import axios from "axios";
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
 

  try {
    const body = await readBody(event);
    //console.log(event)
    const formData = new FormData();
    formData.append('files', body)

    console.log("Successfully Upload");
    console.log(formData);
    const response = await axios.post(`${STRAPI_BASEURL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${process.env.API_UPLOAD_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
})
