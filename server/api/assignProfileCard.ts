import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {
      cardid: body.cardid,
      profile_publicid: body.profile_publicid,
      profileid: body.profileid
    }

    const myResult = await axios.post(`${BASE_URL}/api/card/assign-profile-card`, myPayload)
    if (myResult) {
      return myResult.data;
    }


  } catch (err) {
    console.log(err)
  }
})
