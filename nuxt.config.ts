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
    '@nuxtjs/supabase',
    //...
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOption: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      cookieRedirect: false,
      exclude: ['/gate', '/grid', '/admin', '/admin/profiles', '/admin/cards'],
    },
  },

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
      apiToken: process.env.API_UPLOAD_TOKEN,
      apiBase: process.env.BASE_URL,
    }
    
  }
})
