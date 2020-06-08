import {
  isLogin,
  getUserInfo
} from '@/api/user'
import {
  setToken,
  getToken,
  getHasLogin,
  setHasLogin,
} from '@/libs/util'
import router from '@/router'

export default {
  state: {
    userName: '',
    mobile:'',
    isSign:false,   // 是否签到
    isShowIntegral:false,
    userId: '',
    gender: '',
    avatorImgPath: '',
    token: getToken(),
    hasGetInfo: getHasLogin(),
    loginUserInfo:{},
    superAdmin: false
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setGender(state, gender) {
      state.gender = gender
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setUserMobile(state, value) {
      state.mobile = value
    },
    setSign (state, value) {
      state.isSign = value
    },
    changeChart(state){

    },
    setLoginUserInfo (state, obj) {
      state.loginUserInfo = obj
    },
    setAccess (state, access) {
      state.access = access
    },
    setHasLogin (state, hasLogin) {
      state.hasLogin = hasLogin;
      setHasLogin(hasLogin)
    },
    setToken(state, token) {
      state.token = token;
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setUserName', '')
        commit('setUserMobile', '')
        commit('setUserId', '')
        commit('setHasLogin', false)
        commit('setLoginUserInfo', {});
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            // 代表已经登录状态
            if(res.responseCode =='100'){
              const data = res.vo
              if(data){
                commit('setUserName', data.userAccount)
                commit('setUserMobile', data.mobile)

                commit('setUserId', data.id)
                commit('setHasLogin', true)
                commit('setLoginUserInfo', data);
              }
            }else{
              commit('setUserName', '')
              commit('setUserMobile', '')
              commit('setUserId', '')
              commit('setHasLogin', false)
              commit('setLoginUserInfo', {});
            }
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户相关信息
    isLogin ({ state, commit }) {
      const that = this;
      return new Promise((resolve, reject) => {
        try {
          isLogin().then(res => {
            // TODO 判断是否已经登录
            console.log(res.data);
            if(res.data.vo === 1){// 退出操作
              return new Promise((resolve, reject) => {
                commit('setToken', '')
                commit('setAccess', [])
                commit('setHasLogin', false)
                resolve()
                // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                // commit('setToken', '')
                // commit('setAccess', [])
                // resolve()
              })
            }else{  // 登录操作，获取登录信息
              getUserInfo().then(res => {
                that.$router.push({
                  name: this.$config.homeName
                })
              })
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // FIXME 获取登录状态
    getLoginStatus ({ state, commit }) {

    }
  }
}
