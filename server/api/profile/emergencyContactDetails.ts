import axios from 'axios'
const STRAPI_BASEURL = process.env.STRAPI_BASEURL;
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {    
      profile_publicid: body.profile_publicid
    }
    const result = await axios.post(
      `${STRAPI_BASEURL}/api/profile-contacts/profile-contact`,
      myPayload,
    )
    if (result) {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
})
