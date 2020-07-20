import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/user.vue'
import Rights from '../components/authority/rights.vue'
import Role from '../components/authority/role.vue'
import GoodCate from '../components/goodsmangement/good_category'
import GoodParams from '../components/goodsmangement/good_params'
import GoodList from '../components/goodsmangement/good_list'
import AddGoods from '../components/goodsmangement/add_goods'
import Orders from '../components/orders/orders'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Role },
      { path: '/categories', component: GoodCate },
      { path: '/params', component: GoodParams },
      { path: '/goods', component: GoodList },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Orders }
    ]
  }
]

const router = new VueRouter({
  routes
})
//  挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //  to表示将要访问的路径
  //  from 表示从哪个路径跳转来
  //  next表示放行
  if (to.path === '/login') return next()
  //  获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
