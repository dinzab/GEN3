import path from "path";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n-edge'
  ],
  i18n: {
    vueI18n: './i18n.config.ts' // if you are using custom path, default 
  },
  runtimeConfig: {
    public: {
      base: process.env.DINZAB
    }
  },
  plugins: [
    './plugins/axios',
    '~/plugins/maska',
  ],
  css: [
    "~/assets/dinzab.css"
  ],
  vite: {
    resolve: {
      alias: {
        types: path.resolve(__dirname,'types')
      }
    }
  },
  app: {
    head: {
      title: "Loading please wait ...",
      
      link: [{ rel: 'icon', type: 'image/png', href: "/x.ico" }]
      
    }
  }

})
