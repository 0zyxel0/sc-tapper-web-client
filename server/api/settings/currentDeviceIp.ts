const DEVICE_BASEURL = process.env.DEVICE_BASEURL || 'http://localhost:1337'
export default defineEventHandler(() => {
      return DEVICE_BASEURL
})
