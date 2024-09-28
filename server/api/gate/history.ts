import axios from 'axios'
const STRAPI_BASEURL = process.env.STRAPI_BASEURL
export default defineEventHandler(async (event) => {
  try {
    const myResult = await axios.get(`${STRAPI_BASEURL}/api/gate-history/user/logs`)
    if (myResult) {
      return myResult.data;
    }
  } catch (err) {
    console.log(err)
  }
})
