import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
import cloneDeep from 'lodash/cloneDeep'
const getDefaultState = () => {
  return {
    token: getToken(), // token数据(用来实现自动登录,访问特定接口)
    name: '', // 用户的名字
    avatar: '', // 用户的头像

    roles: [], // 角色权限的数据
    buttons: [], // 按钮权限的数据
    routes: [], // 路由信息权限数据
    asyncRoutes: []  // 异步路由信息数据
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储名字
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 存储头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 存储用户名字/头像/按钮权限/角色权限的数据
  SET_USER: (state, userInfo) => {
    state.avatar = userInfo.avatar
    state.name = userInfo.name
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },
  // 有一个专门存储异步路由信息数据及所有路由信息数据的
  SET_ROUTES: (state, asyncRoutes) => {
   
    // asyncRoutes---数组---过滤之后的数组

    // 此时保存了过滤后的异步路由权限数据----数组-----
    state.asyncRoutes = asyncRoutes
    // 把过滤后的权限路由数组和常量路由数组,和任意路由合并到一起存储起来
    state.routes = constantRoutes.concat(asyncRoutes, anyRoutes)
    // 把现在的路由器对象中的routes进行一个替换或者叫追加的操作
    router.addRoutes([...asyncRoutes, anyRoutes])

  }

}

const actions = {
  // 用户登录
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息的
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 不需要再传入这个token了
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 此时接口调用成功了,有数据啦
        // const { name, avatar } = data
        // 保存用户相关的信息
        commit('SET_USER', data)
        // console.log(data)
        // 存储异步路由对象的数组的同时直接进行过滤
        commit('SET_ROUTES', filterAsyncRoutes(cloneDeep(asyncRoutes), data.routes))

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
// 用来过滤路由对象的----递归操作
function filterAsyncRoutes (asyncRoutes, routeNames) {
  // 过滤异步路由对象数组数据
  return asyncRoutes.filter(route => {
    // 判断路由信息对象中的name和routeNames中的名字是否有包含关系
   
    if (routeNames.includes(route.name)) {
      // 判断当前的路由对象中是否有子路由
      if (route.children && route.children.length) {
        // 获取子路由
        const cRoutes = filterAsyncRoutes(route.children, routeNames)
        // console.log(cRoutes)
        // 判断子路由是否存在
        if (cRoutes&&cRoutes.length>0) {
          route.children = cRoutes
          return true
        }

        return false
      }

      return true
    }
    return false
  })
}

export default {
  // 命名空间,如果这个属性的值为true,那么代表的是:当前的这个模块开启了命名空间
  namespaced: true,
  state,
  mutations,
  actions
}

