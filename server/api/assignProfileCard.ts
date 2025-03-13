import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {
      cardid: body.cardid,
      profile_publicid: body.profile_publicid,
      profileid: body.profileid
    }

    const myResult = await axios.post(`${STRAPI_BASEURL}/api/card/assign-profile-card`, myPayload)
    if (myResult) {
      return myResult.data;
    }


  } catch (err) {
    console.log(err)
  }
})
