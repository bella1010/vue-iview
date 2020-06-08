import {
  getBreadCrumbList,
  // getMenuByRouter,
  setTagNavListInLocalstorage,
  getTagNavListFromLocalstorage,
  setCategoryListInLocalstorage,
  getCategoryListFromLocalstorage,
  setIndexBannerListInLocalstorage,
  setIndexHotProListInLocalstorage,

  setProMapListInLocalstorage,
  getProListInLocalstorage,

  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    menuCollapsed:false,  // 菜单产品分类是否显示
    breadCrumbList: [],
    tagNavList: [],
    categoryList: [],
    indexBannerList: [],
    indexHotProList:[],
    indexAidProList:[],
    indexCoolProList:[],
    proMapList:{},
    homeRoute: {},
    local: localRead('local')
  },
  getters: {
    menuList: (state, getters, rootState) => {
      // return getMenuByRouter([...routers, ...rootState.user.menu])
    },
    dynamicRouters: (state, getters, rootState) => {
      return rootState.user.menu.length > 0 ? [...rootState.user.menu] : []
    }
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    // 设置首页Banner缓存
    setIndexBannerList (state, list) {
      state.indexBannerList = list;
      setIndexBannerListInLocalstorage([...list]);
    },
    // 设置首页热门礼品
    setIndexHotProList (state, list) {
      state.indexHotProList = list;
      setIndexHotProListInLocalstorage([...list]);
    },
    setProMapList (state, map){
      const current = getProListInLocalstorage();
      const newMap = {...current, ...map};
      setProMapListInLocalstorage(newMap);
    },
    getProMapList (state, key){
      state.proMapList[key] = getProListInLocalstorage(key);
    },
    setCategoryList (state, list) {
      let tagList = []
      if (list) {
        // 对源数据深度克隆
        let cloneData = JSON.parse(JSON.stringify(list))
        const tempList =  cloneData.filter(father => {
          // 返回每一项的子级数组
          let branchArr = cloneData.filter(child => father.categoryId === child.parentId)
          // 如果存在子级，则给父级添加一个children属性，并赋值
          branchArr.length > 0 ? father.children = branchArr : ''
          // 返回第一层
          return father.parentId === '0';
        });
        tagList = [...tempList]
      } else
        tagList = getCategoryListFromLocalstorage() || []

      state.categoryList = tagList
      setCategoryListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    }
  }
}
