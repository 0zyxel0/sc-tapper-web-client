import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  const publicid = getRouterParam(event, "publicid")
 
  try {
    const body = await readBody(event)

    const myPayload = {
      student_no: body.student_no,
      last_name: body.last_name,
      first_name: body.first_name,
      middle_name: body.middle_name
    }

    const myResult = await axios.put(`${STRAPI_BASEURL}/api/profiles/details/update/${publicid}`, myPayload)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err);
  }
 
})
