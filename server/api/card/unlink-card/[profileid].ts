import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {

  const profileid = getRouterParam(event, 'profileid')
  try {
    const myResult = await axios.delete(`${STRAPI_BASEURL}/api/card/unlink-profile-card/${profileid}`)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
