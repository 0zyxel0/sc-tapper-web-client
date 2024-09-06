import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {

  const profileid = getRouterParam(event, 'profileid')
  try {
    const myResult = await axios.delete(`${BASE_URL}/api/card/unlink-profile-card/${profileid}`)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
