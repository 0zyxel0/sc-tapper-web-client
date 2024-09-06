import * as dotenv from 'dotenv'
dotenv.config()
import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:8000'
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY)
export default defineEventHandler(async (event) => {    
  try {
    const body = await readBody(event)
    const recordId = body.profileid;
    const { data: cards, error } = await supabase
      .from('profiles')
      .select('*, profile_contacts(*)')
      .eq('id', recordId);
    if (cards) {
      return cards
    }
  } catch (err) {
    console.log(err)
  }
})
