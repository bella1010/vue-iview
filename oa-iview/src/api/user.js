import { get, post } from '@/libs/api.request'
// import axios from 'axios';

export const isLogin = () => {
  return get('/ucenter/ulogin/isLogout.jhtml',
    {
      t:Math.random()
    })
}


export const getUserInfo = () => {
  return get('/ucenter/ulogin/getUserInfo.jhtml',
    {
      t:Math.random()
    })
}

/**
 * 用户签到接口
 * @returns {Promise}
 */
export const signIn = () => {
  return post('/api/pshop/user/signIn');
}
/**
 * 获取用户签到数据
 * @returns {Promise}
 */
export const getSignIn = () => {
  return get('/api/pshop/user/getSignIn');
}


/*


export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}


export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
*/
