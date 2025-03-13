import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {
      cardid: body.cardid,
      profileid: body.profileid,
      profile_publicid: body.profile_publicid,
      profile_avatar: body.profile_avatar
    }

    const myResult = await axios.post(`${STRAPI_BASEURL}/api/gate-history/create`, myPayload)
    if (myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err);
  }
})
