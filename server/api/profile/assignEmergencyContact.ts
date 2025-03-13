import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {
      name: body.name,
      relation: body.relation,
      contactNumber: body.contactNumber,
      profile_publicid: body.profile_publicid
    }

    const result = await axios.post(
      `${STRAPI_BASEURL}/api/profile-contacts/assign-contact`,
      myPayload,
    )
    if (result) {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
})
