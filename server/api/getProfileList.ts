import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL


export default defineEventHandler(async (event) => {
  try {
    //const body = await readBody(event)
    const myResult = await axios.get(`${BASE_URL}/api/profiles/list`)
    if(myResult) {
      //console.log("List of Profile: ", myResult.data);
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
