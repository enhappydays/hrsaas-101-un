import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  // 默认路由数组只有静态的路由规则
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, otherRoutes) {
    // 每个人进来都应该是基于静态路由,新增一些动态路由,而不是累加push
    state.routes = [...constantRoutes, ...otherRoutes]
  }
}
const actions = {
  // 1. 根据用户信息中的menus数组筛选出该用户拥有哪些页面访问权限
  filterRoutes(context, menus) {
    // 注意: 我们的筛选是以模块作为单位的
    const otherRoutes = asyncRoutes.filter(item => menus.includes(item.children[0].name))
    console.log('结束路由筛选', otherRoutes)
    context.commit('setRoutes', otherRoutes)
    return otherRoutes
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
