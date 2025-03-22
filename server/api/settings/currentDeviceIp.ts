const STRAPI_BASEURL = process.env.STRAPI_BASEURL
export default defineEventHandler(() => {
      return STRAPI_BASEURL
})
