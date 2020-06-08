import axios from 'axios' // 引用axios
import Qs from 'qs' // 引入数据格式化
import store from '@/store'
import { Message, Modal } from 'iview';

// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
  config => {
    // console.log('请求路径', config.url)
    if (config.url === '/b/carModel/createCarModelVersion') {
      // 此处设置文件上传，配置单独请求头
      config.headers = {
        'Content-Type': 'multipart/form-data'
      }
    } else {
      // 通过后台request自动获取用户登录信息
      let userInfo = store.state.userInfo;
      if(config.method ==='post'){
        config.headers = {
          'Content-Type': 'application/json' // 设置跨域头部
        }
      }else{
        config.data = Qs.stringify(config.data)
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log('请求拦截返回参数', response)
    if (response.status === 200) {
      // 成功
      let returnCode = response.data.code||response.data.responseCode
      if (returnCode == '100' || returnCode == '200') {
        // console.log('成功', response)
      } else if (returnCode === '101') {
        // 只弹窗，不操作
        console.error('失败:', response)
        // Message.error(response.data.msg)
      }else{
        Message.error(response.data.msg)
      }
      return response;
    }
    return response
  },
  error => {

    console.log('error', error.toString())
    if (
      error.toString().trim() ===
      "TypeError: Cannot read property 'cancelToken' of null"
    ) {
      localStorage.removeItem('userInfo')
      model.confirm({
        content:'会话凭证失效，可以取消继续留在该页面，或者重新登录',
        title:'确定登出',
        onOk: ()=>{
          // TODO 跳转到登录页面
          location.href="";
        },
        onCancel: ()=>{

        }
      })
    }

    // console.log(error.toString().trim())
    if (error.toString().trim() === 'Error: Network Error') {
      Modal.warning({
        title: '出错了',
        content:'网络请求异常，请稍后重试'
      })
    }
    return Promise.reject(error.response.data)
  }
)

export default axios

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        // console.log(response.data.code)
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}
