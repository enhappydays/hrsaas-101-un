import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// 创建一个新的axios实例
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 超时时间
})

// 添加请求拦截器
http.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = store.getters.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(function(response) {
  // 对响应数据做点什么

  const res = response.data

  if (res.success === false) {
    // 说明请求成功了, 但是登录失败了
    // success: false 这个时候应该走catch,需要返回一个失败的promise
    Message.error(res.message)
    // return new Promise((resolve, reject) => {
    //   reject()
    // })
    return Promise.reject(new Error(res.message))
  }

  return res
}, function(error) {
  // 对响应错误做点什么
  if (error.response.status === 401 && error.response.data.code === 10002) {
    // 1. 提示用户
    Message.error('您当前的登录已过期, 请重新登录~')
    // 2. 退出登录数据处理
    store.dispatch('user/logout')
    // 3. 跳转回登录页
    router.push('/login')
  } else {
    // 将来服务器错误, 提示一下用户
    Message.error(error.message)
  }

  return Promise.reject(error)
})
export default http
