import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const imageid = getRouterParam(event, "imageid")

  try {
    const myResult = await axios.delete(`${BASE_URL}/api/upload/files/${imageid}`)
    if(myResult) {
      return myResult.data;
    }
  } catch (error) {
    console.log(error);
  }
})
