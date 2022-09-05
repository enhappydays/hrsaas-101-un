// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
import router from '@/router'
import store from '@/store'
import { asyncRoutes } from '@/router'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
NProgress.configure({ showSpinner: false }) // 隐藏进度条右侧加载圆环
const WHITE_LIST = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      if (!store.state.user.userInfo.userId) {
        // 等一个异步的操作结束以后, 再做某件事 => 封装promise
        const res = await store.dispatch('user/getUserInfo')
        console.log(res, 1122)
        const otherRoutes = await store.dispatch('permission/filterRoutes', res.roles.menus)
        // 动态新增路由(异步的,避免出现问题,重新进一次页面)
        router.addRoutes([
          ...otherRoutes,
          { path: '*', redirect: '/404', hidden: true }])

        // 你原来想去哪, 就去哪(其他参数也带上), 但是要replace
        // next({
        //   path: to.path,
        //   params: to.params,
        //   query: to.query
        // })
        next({
          ...to, // 重新去一次原来要去的地方
          replace: true // 解决跳转历史重复的问题
        })
        // 注意: 加返回
        return
      }
      next()
    }
  } else {
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置守卫(页面进入之后)
// 有一种情况后置守卫不会触发: 前置守卫中如果做了拦截处理
// 解决: 拦截的地方手动关闭进度条
router.afterEach((to, from) => {
  setTimeout(() => {
    NProgress.done()
  }, 300)
})
