import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      student_no: body.student_no,
      publicid: body.publicid,
      image_url: body.image_url,
      image_id: body.image_id      
    }

    const myResult = await axios.post(`${STRAPI_BASEURL}/api/profiles/users/create`, myPayload)
    if (myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
