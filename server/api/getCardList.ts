import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    const myResult = await axios.get(`${BASE_URL}/api/cards/assigned/user-cards`)
    if(myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
