import { reqGetBaseInfo, reqGetProfile, reqLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken() || '',
  userInfo: {}
}
const mutations = {
  // 1.设置token
  setNewToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  },
  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo
  },
  // 退出
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(ctx, data) {
    const res = await reqLogin(data)
    console.log(res)
    const newToken = res.data
    ctx.commit('setNewToken', newToken)
    return res
  },
  // login(context, data) {
  //   return new Promise((resolve, reject) => {
  //     reqLogin(data).then((res) => {
  //       console.log(res)
  //       const newToken = res.data
  //       context.commit('setNewToken', newToken)
  //       // Message.success('登录成功')
  //       resolve(res)
  //     }).catch((err) => {
  //       console.log(err)
  //       reject(err)
  //     })
  //   })
  // },
  async getUserInfo(ctx) {
    // 2.1 发起网络请求
    const res = await reqGetProfile()
    const res2 = await reqGetBaseInfo(res.data.userId)
    // console.log(res, '-----')
    // console.log(res2, '66666')
    const obj = {
      ...res.data,
      ...res2.data
    }
    console.log(obj, '9999')
    // 2.2 存储到仓库中
    ctx.commit('setUserInfo', obj)
    // 2.3 把结果返回给外部
    return obj
  },
  // 用promise封装
  // getUserInfo(context) {
  //   return new Promise((resolve, reject) => {
  //     reqGetProfile().then((res) => {
  //       console.log(res, 999)
  //       context.commit('setUserInfo', res.data)
  //       resolve(res)
  //     }).catch((err) => {
  //       reject(err)
  //     })
  //   })
  // }
  logout(ctx) {
    ctx.commit('removeToken')
    ctx.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

