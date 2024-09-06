import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const publicid = getRouterParam(event, "publicid")

  try {
    const body = await readBody(event)

    const myPayload = {
      image_url: body.image_url,
      image_id: body.image_id
    }

    const myResult = await axios.put(`${BASE_URL}/api/profiles/photo/update/${publicid}`, myPayload)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err);
  }
})
