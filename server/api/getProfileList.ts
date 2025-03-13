import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL


export default defineEventHandler(async (event) => {
  try {
    //const body = await readBody(event)
    const myResult = await axios.get(`${STRAPI_BASEURL}/api/profiles/users/available`)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
