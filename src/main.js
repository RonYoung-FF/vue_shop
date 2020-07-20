import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//  导入树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入父文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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
// 全局过滤器把毫秒转化成公元
Vue.filter('dateFormat', function (date, form) {
  date = parseInt(date * 1000)
  const msDate = new Date(date)
  const date1 = msDate.toLocaleDateString().replace(/\//g, '-')
  if (form === 'yyyy-MM-dd') {
   return (date1)
  } else if (form === 'yyyy-MM-dd hh:mm:ss') {
   var date2 = date1 + ' ' + msDate.toTimeString().substr(0, 8)
   return date2
  }
})
Vue.config.productionTip = false
// 全局注册树形表格组件
Vue.component('tree-table', TreeTable)
// 全局注册父文本编辑器组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
