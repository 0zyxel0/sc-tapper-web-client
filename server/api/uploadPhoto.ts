import FormData from "form-data";
import axios from "axios";
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
 

  try {
    const body = await readBody(event);
    //console.log(event)
    const formData = new FormData();
    formData.append('files', body)

    console.log("Successfully Upload");
    console.log(formData);
    const response = await axios.post('http://localhost:1337/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${process.env.API_UPLOAD_TOKEN}`
      }
    });

    // const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   }
    // });
    // if (response) {
    //   console.log(response);
    //   return response;
    // }
    return response.data;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }


  // const form = new FormData();
  // form.append('files', body.name);

  // try {
  //   const response = await axios.post(`${process.env.BASE_URL}/api/upload`, form, {
  //     headers: {
  //       ...form.getHeaders(),
  //       Authorization: `Bearer ${process.env.API_UPLOAD_TOKEN}`
  //     }
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw createError({ statusCode: 500, message: 'Image upload failed'});
  // }
})
