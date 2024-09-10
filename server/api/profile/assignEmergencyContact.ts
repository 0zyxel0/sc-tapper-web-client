import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

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
      `${BASE_URL}/api/profile-contacts/assign-contact`,
      myPayload,
    )
    if (result) {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
})
