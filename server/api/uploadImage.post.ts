import FormData from "form-data";
import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body.name)

  if(!body || !body.name) {
    throw createError({ statusCode: 400, message: 'No file provided'});
  }

  const form = new FormData();
  form.append('files', body.name);

  try {
    const response = await axios.post(`${process.env.BASE_URL}/api/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.API_UPLOAD_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Image upload failed'});
  }
})
