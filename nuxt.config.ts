import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
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
    transpile: ['vuetify', 'vue-toastification'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-time',
    '@pinia/nuxt',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  typescript: {
    strict: false,
  },

  runtimeConfig: {
    public: {
      apiToken: process.env.API_TOKEN,
      apiBase: process.env.STRAPI_BASEURL,
      imageBase: process.env.IMAGEBASE_URL,
    }
    
  }
})
