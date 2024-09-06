import * as dotenv from 'dotenv'
dotenv.config()
import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:8000'
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY)
export default defineEventHandler(async (event) => {
  try {
    const { data: cards, error } = await supabase
      .from('gate_history')
      .select('*')
      .limit(100);
    if (cards) {
      return cards
    }
  } catch (err) {
    console.log(err)
  }
})
