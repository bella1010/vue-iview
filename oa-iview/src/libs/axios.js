import iView from 'iview'
import axios from 'axios'
import router from '../router'
import store from '../store/'

class HttpRequest {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
    this.queue = []
  }
  getInsideConfig(options) {
    const config = {
      baseURL: this.baseUrl,
      timeout: options.timeout || 5000
    }
    if (store.state.user.token) {
      config.headers = {
        Authorization: store.state.user.token
      }
    }
    return Object.assign(config, options)
  }
  destroy(url) {
    this.queue.splice(this.queue.findIndex(item => item === url), 1)
    if (!this.queue.length) {
      iView.Spin.hide()
    }
  }
  interceptors(instance, {
    url,
    loading = false
  }) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (loading && !this.queue.length) {
        iView.Spin.show()
      }
      loading && (this.queue.push(url))
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(({
      data,
      status,
      headers
    }) => {
      this.destroy(url)
      // 请求成功处理（包括后台异常）
      if (status === 200 && data.success && data.data) {
        if (url === '/api/login') {
          data.data.token = headers.authorization
        }
        return data.data
      } else {
        return Promise.reject(data.message || '数据异常，请联系管理员')
      }
    }, error => {
      this.destroy(url)
      // 请求出错处理
      let message = error.message || '操作失败，请检查网络连接'
      try {
        if (error.response.status === 401) {
          store.dispatch('handleLogOut').then(() => {
            router.push({
              name: 'login'
            })
          })
        }
        message = error.response.data.message || message
      } catch (e) {
        console.error(e)
      }
      return Promise.reject(message || '未知错误，请联系管理员')
    })
  }
  request(options) {
    const instance = axios.create()
    options = this.getInsideConfig(options)
    this.interceptors(instance, options)
    return instance(options)
  }
}
export default HttpRequest