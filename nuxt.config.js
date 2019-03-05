const pkg = require('./package')
const webpack = require('webpack')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    __dangerouslyDisableSanitizers: ['script'],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        innerHTML: `(function (h, o, t, j, a, r) {
      h.hj = h.hj || function () {(h.hj.q = h.hj.q || []).push(arguments)}
      h._hjSettings = {hjid: 743433, hjsv: 6}
      a = o.getElementsByTagName('head')[0]
      r = o.createElement('script')
      r.async = 1
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')`,
        type: 'text/javascript',
        charset: 'utf-8'
      },
      {
        type: 'text/javascript',
        id: 'hs-script-loader',
        async: true,
        defer: true,
        src: '//js.hs-scripts.com/5313390.js'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#FFFFFF' },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/bootstrap.min.css',
    '@/assets/css/now-ui-kit.scss',
    '@/assets/css/demo.css',
    '@/assets/css/montserrat.css',
    'devices.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    /*'~/plugins/google-maps'*/
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    ['bootstrap-vue/nuxt', { css: false }],
    ['@nuxtjs/google-analytics'],
    [
      'nuxt-i18n',
      {
        baseUrl: 'https://skedr.io',
        strategy: 'prefix_except_default',
        lazy: true,
        defaultLocale: 'en',
        langDir: 'locales/',
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected'
        },
        locales: [
          {
            name: 'English',
            code: 'en',
            iso: 'en-US',
            file: 'en.js'
          }
          // {
          //   name: 'Español',
          //   code: 'es',
          //   iso: 'es-ES',
          //   file: 'es.js'
          // }
        ]
      }
    ]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: `https://${process.env.NUXT_ENV_API_ID}.execute-api.eu-west-1.amazonaws.com/${process.env.NUXT_ENV_STAGE}`
  },

  'google-analytics': {
    id: 'UA-53011336-4',
    debug: {
      sendHitTask: process.env.NODE_ENV === 'production'
    }
  },

  generate: {
    minify: {
      removeOptionalTags: false
    },
    routes: ['/articles/share-single-photo', '/articles/group-tagging']
  },
  vendor: ['image-webpack-loader'],
  /*
   ** Build configuration
   */
  build: {
    extractCSS: {
      allChunks: true
    },

    plugins: [
      new webpack.DefinePlugin({
        'global.GENTLY': false
      })
    ],

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.module.rules.forEach(rule => {
        if (rule.test.toString() === '/\\.(png|jpe?g|gif|svg)$/') {
          rule.use = [
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                name: 'img/[name].[hash:7].[ext]'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: '65-90',
                  speed: 1,
                  verbose: true
                  // },
                  // webp: {
                  //   quality: 75
                }
              }
            }
          ]
          delete rule.loader
          delete rule.options
        }
      })
    }
  },

  router: {
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return { selector: to.hash }
      } else {
        return { x: 0, y: 0 }
      }
    }
  }
}
