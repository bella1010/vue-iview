import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setTitle, getHasLogin } from '@/libs/util'
import config from '@/config'
const { publicPath } = config

Vue.use(Router)
const router = new Router({
  routes,
  base: publicPath,
  mode: 'history'
})

// 需要登录的路由名称：
const needLoginRouter = [
  'orderSubmit'
];
const turnTo = (fn) => {
  const hasLogin = getHasLogin()
  console.log("是否为登录状态："+hasLogin);
  if(!hasLogin){
    fn();
    // window.location.href="/ucenter/ulogin/login.jhtml";// 跳转到登录页
  }else{
    fn();
  }
}
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if(needLoginRouter.indexOf(to.name)!=-1 || store.state.loginUserInfo){
    // 如果未登录跳转到登录页面
    turnTo(()=>{
      next()
    });
  }
  store.dispatch('getUserInfo').then(user => {
    // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
    turnTo(()=>{
      next()
    })
  }).catch(() => {
    // setToken('')
    next()
  })
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
console.log(router)

export default router



// import Vue from 'vue'
// import Router from 'vue-router'
//
// import Home from '@/pages/Index'
// import HelloWorld from '@/components/HelloWorld'
//
// Vue.use(Router)
//
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Index',
//       component: Home
//     },
//     {
//       path: '/hello',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
