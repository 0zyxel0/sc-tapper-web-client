import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  const publicid = getRouterParam(event, "publicid")

  try {
    const body = await readBody(event)

    const imageid = body.image_id

    // Delete profile details in profiles table
    const deleteProfileResult = await axios.delete(`${STRAPI_BASEURL}/api/profiles/delete/${publicid}`);

    // Delete profile photos from files table
    const deletePhotoResultt = await axios.delete(`${STRAPI_BASEURL}/api/upload/files/${imageid}`);

    if (deletePhotoResultt) {
      return deleteProfileResult.data;
    }
  } catch(error) {
    console.log(error);
  }
})
