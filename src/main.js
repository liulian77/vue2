import Vue from 'vue'
import "babel-polyfill"
import router from '@/router'
import store from '@/store'
import '../my-theme/index.less'
import '@/styles/css/index.less'
import '@/styles/css/fontMore/iconfont.css'
import '@/styles/css/fonts-appstore/iconfont.css'
import '@/styles/css/fontsEx/iconfont.css'
import config from '@/config'
import Loading from '_c/loading'
import { globalMixin } from '@/mixins'
import App from '@/App.vue'

// const App = () => import(/* webpackChunkName: "App" */ '@/App.vue')

Vue.mixin(globalMixin)
Vue.component('Loading', Loading)
Vue.config.productionTip = false
Vue.prototype.$config = config
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
