import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  const imageid = getRouterParam(event, "imageid")

  try {
    const myResult = await axios.delete(`${STRAPI_BASEURL}/api/upload/files/${imageid}`)
    if(myResult) {
      return myResult.data;
    }
  } catch (error) {
    console.log(error);
  }
})
