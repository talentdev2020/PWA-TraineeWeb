import colors from 'vuetify/es5/util/colors'

//import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
module.exports = {
  /*
  ** Headers of the page
  */
 mode: 'universal',
  buildDir: '../functions/nuxt',

  head: {
    title: 'Trainee web app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/v.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
  ** Customize the progress bar colors
  */
plugins:[ '~plugins/firebase.js','~plugins/vuetify.js' ,{ src: '~/plugins/localStorage.js', ssr: false } ],
 modules: ['@nuxtjs/pwa','@nuxtjs/toast'  ],
css: ['~assets/main.css'
],

toast: {
  position: 'top-center',
  register: [ // Register custom toasts
    {
      name: 'my-error',
      message: 'Oops...Something went wrong',
      options: {
        type: 'error'
      }
    }
  ]
},

buildModules: [
  '@nuxtjs/vuetify',
],
babel: {
  presets: [
    'es2015',
    'stage-0'
  ],
  plugins:
    ['transform-runtime', {
      'polyfill': true,
      'regenerator': true,
    }
  ],
},
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
 vuetify: {
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
},
 router:{

  middleware:'stats'
 },
  build: {
    /*
    ** Run ESLint on save
    */

  //  plugins: [new VuetifyLoaderPlugin()],
    publicPath: '/',
    vendor: ['axios', 'babel-polyfilly', 'vuetify' ],
    extractCSS: true,
  }
}

