import Vue from 'vue'
import Vuex from 'vuex'
import basic from './basic'
import router from './router'
import app from './app'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        basic,
        router,
        app
    }
}) 