import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  devtools: { enabled: false },
  pages: true,
  ssr:false,
  build: {
    transpile: ['vuetify', 'vue-toastification'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-time',
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
      apiBase: process.env.BASE_URL,
    }
    
  }
})
