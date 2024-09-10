import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {    
      profile_publicid: body.profile_publicid
    }

    const result = await axios.post(
      `${BASE_URL}/api/profile-contacts/profile-contact`,
      myPayload,
    )
    if (result) {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
})
