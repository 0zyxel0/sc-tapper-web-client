import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    //const body = await readBody(event)
    // const cardID = getRouterParam(event, 'cardid')
    const { cardid } = getQuery(event);
    const myResult = await axios.get(`${BASE_URL}/api/card/search-card/${cardid}`)
    if (myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
