// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
  app: {
    rootId: 'nuxt-ui',
    rootTag: 'nuxt-ui',
    baseURL: '/',
    buildAssetsDir: '_oc',
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      bodyAttrs: {
        class: 'oc-body',
      },
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [],
      script: [],
    },
  },

  components: true,
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css',
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  vite: {
    esbuild: {
      drop: ['console', 'debugger'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@use "@/assets/styles/_vars.scss" as *;',
        },
      },
    },
    optimizeDeps: {
      exclude: ['#import'], // Exclude this module from Vite's optimization process
    },
  },
  modules: ['@nuxt/ui'],
})
