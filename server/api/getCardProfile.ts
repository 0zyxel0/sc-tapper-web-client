import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    //const body = await readBody(event)
    // const cardID = getRouterParam(event, 'cardid')
    const { cardid } = getQuery(event);
    console.log("Card ID 1", cardid);

    const myResult = await axios.get(`${BASE_URL}/api/card/search-card/${cardid}`)
    if (myResult) {
      return myResult.data;
    }

    console.log("Card ID 2", cardid);

    // const { data: cards, error } = await supabase
    //   .from('cards')
    //   .select('*, profiles(*)')
    //   .eq('cardid', recordId)
    // if (cards) {
    //   return cards
    // }


  } catch (err) {
    console.log(err)
  }
})
