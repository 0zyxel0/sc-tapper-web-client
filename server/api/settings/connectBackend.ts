const STRAPI_BASEURL = process.env.STRAPI_BASEURL || 'http://localhost:1337'
export default defineEventHandler(() => {
      return STRAPI_BASEURL
})
