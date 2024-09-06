import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const publicid = getRouterParam(event, 'publicid')
  try {
    const myResult = await axios.get(`${BASE_URL}/api/profiles/details/${publicid}`)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
