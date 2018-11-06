import Vue from 'vue'
import App from './App'
import store from './store/index'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store=store
// Vue.prototype.globalData = getApp().globalData
const app = new Vue(App)
app.$mount()
