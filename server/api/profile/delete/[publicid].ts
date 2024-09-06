import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const publicid = getRouterParam(event, "publicid")

  try {
    const body = await readBody(event)

    const imageid = body.image_id

    // Delete profile details in profiles table
    const deleteProfileResult = await axios.delete(`${BASE_URL}/api/profiles/delete/${publicid}`);

    // Delete profile photos from files table
    const deletePhotoResultt = await axios.delete(`${BASE_URL}/api/upload/files/${imageid}`);

    if (deletePhotoResultt) {
      return deleteProfileResult.data;
    }
  } catch(error) {
    console.log(error);
  }
})
