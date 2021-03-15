import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
// 全局前置路由守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 获取每个路由信息对象中的title值,这是页面中的标题信息数据
  document.title = getPageTitle(to.meta.title)

  // 获取token---
  const hasToken = getToken()
  // 判断token----如果token存在说明可以自动登录
  if (hasToken) {
    // 登录了
    if (to.path === '/login') {
      // 跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 不是登录界面,获取vuex中的用户名信息
      const hasGetUserInfo = store.getters.name
      // 判断用户信息是否存在
      if (hasGetUserInfo) {
        // 放行
        next()
      } else {
        // 没有用户信息
        try {
          // 自动获取用户信息
          await store.dispatch('user/getInfo')
          // 放行---解决白板的bug
          next({...to})
        } catch (error) {
          // 有token但是获取用户信息失败了
          // 重置token,或者叫重置用户信息
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // 跳转到登录界面
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
  // 没有token,要去的地址和当前的/login地址不一样

    if (whiteList.indexOf(to.path) !== -1) {
      // 此时要去登录界面
      next()
    } else {
      // 没有找到,先跳转到登录的界面,同时保存此次要去的地址信息
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置路由守卫
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
