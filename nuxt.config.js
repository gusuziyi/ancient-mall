const pkg = require('./package')


module.exports = {
  mode: 'universal',
 router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'not-find',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      },{
        name: 'q-showDetail',
        path: '/showDetail/:cid',
				props:true,
        component: resolve(__dirname, 'pages/showDetail.vue')
      },{
        name: 'q-shop',
        path: '/shop/:shopCid',
				props:true,
        component: resolve(__dirname, 'pages/shop.vue')
      },{
        name: 'q-list',
        path: '/list/:searchQuery',
				props:true,
        component: resolve(__dirname, 'pages/list.vue')
      },{
        name: 'q-payList',
        path: '/payList/:pickActive',
				props:true,
        component: resolve(__dirname, 'pages/payList.vue')
      })
    }
  },
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
			{ name: 'referrer', content: 'never' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
		'~assets/element-5b005b/index.css',
		'~assets/iconfont/iconfont.css',
		'~assets/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
		'@/plugins/amap'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
