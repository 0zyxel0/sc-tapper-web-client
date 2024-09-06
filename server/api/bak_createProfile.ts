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
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      studentno: body.studentno,      
      image_url: body.image_url          
    }

    const { data, error } = await supabase.from('profiles').insert(myPayload)
    if (error) {
      console.error('Error inserting data:', error)
    } else {
      console.log('Data inserted successfully:', data)
    }
  } catch (err) {
    console.log(err)
  }
})
