import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//  导入全局样式表
import './assets/css/global.css'
//  导入axios模块
import axios from 'axios'
//  把axios的方法挂载到Vue实例
Vue.prototype.$http = axios
//  配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//  配置请求拦截器,在请求头携带token
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
