import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const STRAPI_BASEURL = process.env.STRAPI_BASEURL

export default defineEventHandler(async (event) => {
  try {
    const myResult = await axios.get(`${STRAPI_BASEURL}/api/cards/assigned/user-cards`)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
