import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  const publicid = getRouterParam(event, "publicid")

  try {
    const body = await readBody(event)

    const myPayload = {
      image_url: body.image_url,
      image_id: body.image_id
    }

    const myResult = await axios.put(`${STRAPI_BASEURL}/api/profiles/photo/update/${publicid}`, myPayload)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err);
  }
})
