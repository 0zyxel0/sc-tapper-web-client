import * as dotenv from 'dotenv'
dotenv.config()
import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:8000'
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY)
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const myPayload = {
      cardid : body.cardid,
      profile_publicid: body.profile_publicid,
      profileid: body.profileid      
    }

    const { data, error } = await supabase.from('card').insert(myPayload)
    if (error) {
      console.error('Error inserting data:', error)
    } else {
      console.log('Data inserted successfully:', data)
    }
  } catch (err) {
    console.log(err)
  }
})
