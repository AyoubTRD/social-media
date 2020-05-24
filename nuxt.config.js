import colors from "vuetify/es5/util/colors";

const primaryColor = colors.blueGrey.base;
export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.1.45/css/materialdesignicons.min.css"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: primaryColor, throttle: 0 },
  /*
   ** Global CSS
   */
  css: ["~/assets/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: "~/plugins/vuemasonry.js", ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyDfpkt-Bs1WEXPnVM3GVwn6J9Nh6cI9uxU",
          authDomain: "simple-demo-b69f7.firebaseapp.com",
          databaseURL: "https://simple-demo-b69f7.firebaseio.com",
          projectId: "simple-demo-b69f7",
          storageBucket: "simple-demo-b69f7.appspot.com",
          messagingSenderId: "672328686321",
          appId: "1:672328686321:web:4d32ae2a05e6103a75e750",
          measurementId: "G-6K36RX2FE4"
        },
        services: {
          auth: {
            ssr: {
              serverLogin: true
            }
          },
          firestore: {
            ssr: true
          },
          storage: {
            ssr: true
          }
        }
      }
    ]
  ],

  pwa: {
    // disable the modules you don't need
    meta: false,
    icon: false,
    // if you omit a module key form configuration sensible defaults will be applied
    // manifest: false,

    workbox: {
      importScripts: [
        // ...
        "/firebase-auth-sw.js"
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: false
    }
  },

  axios: {
    baseURL: process.env.BONSAI_URL
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],

    icons: {
      iconfont: "mdi"
    },
    theme: {
      themes: {
        light: {
          primary: primaryColor,
          accent: colors.grey,
          background: colors.grey.lighten5
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    parallel: true,
    cache: true,
    hardsource: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  router: {
    middleware: ["authenticated"]
  }
};
