export default defineNuxtConfig({
  devtools: { enabled: false },
  pages: true,
  ssr:false,
  //@ts-ignore
  server: {
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
    }
  },
  build: {
    transpile: ['vue-toastification'],
  },
  modules: [
    'nuxt-time',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  typescript: {
    strict: false,
  },
 css: [
    '~/assets/css/tailwind.css', // Your main Tailwind CSS file
    '@mdi/font/css/materialdesignicons.min.css', // Material Design Icons
  ],
  runtimeConfig: {
    public: {
      apiToken: process.env.API_TOKEN,
      apiBase: process.env.STRAPI_BASEURL,
      imageBase: process.env.IMAGEBASE_URL,
    }
    
  }
})
