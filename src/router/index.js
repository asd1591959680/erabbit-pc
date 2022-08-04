import store from '@/store'
import { h } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home/index.vue')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const Cart = () => import('@/views/cart/index')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home/index')
const MemberOrder = () => import('@/views/member/order/index')
const MemberOrderDetail = () => import('@/views/member/order/detail')
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      { path: '/', component: Home },
      {
        path: '/category/:id',
        component: TopCategory,
      },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      {
        path: '/member',
        component: MemberLayout,
        children: [{ path: '/member', component: MemberHome }],
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/cart',
    component: Cart,
  },
  {
    path: '/member/checkout',
    component: PayCheckout,
  },
  {
    path: '/member/pay',
    component: PayIndex,
  },
  {
    path: '/member/order',
    // vue3.0 需要有嵌套关系才能模糊匹配
    component: { render: () => h(<RouterView />) },
    children: [
      { path: '', component: MemberOrder },
      { path: ':id', component: MemberOrderDetail },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  //每次切换路由的时候滚动到顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const { token } = store.state.user.profile
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})

export default router
