import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import defaultImage from '_a/images/pro-200.png'

const {
  title,
  cookieExpires,
  useI18n
} = config

export const HAS_LOGIN = 'has_login'
const imgBasePath = config.imgBasePath
// ---------------------------------

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

export const getImageSrc = (src) => {
  if (src) {
    return src.includes('://') ? src : imgBasePath + src
  } else {
    return defaultImage
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000)
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hours = getHandledValue(d.getHours())
  const minutes = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes
  return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp)
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp)
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000)
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime)
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? '前' : '后'
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
  else resStr = getDate(timeStamp, 'year')
  return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * 将一维的扁平数组转换为多层级对象
 * @param  {Array} list 一维数组，数组中每一个元素需包含id和pid两个属性
 * @param  {String} id id取值
 * @param  {String} pid pid取值
 * @return {String} parents 多层级树状结构
 */
export const buildTree = (list, id = 'id', pid = 'pid', tree = true) => {
  if (list[0] && list[0].subMenus) {
    const translator = traList => {
      traList.forEach(item => {
        item.expand = true
        item.title = item.name || 'null'
        item.children = item.subMenus
        item.selected = false
        delete item.subMenus
        translator(item.children)
      })
    }
    translator(list)
    return [{
      // id: '0',
      title: '全部',
      expand: true,
      selected: true,
      children: list
    }]
  } else {
    let parents = list.filter(value => value[pid] === null || value[pid] === undefined || value[pid] == 0 || value[pid] === '' || value[pid] === '#' || value[pid] === '*')
    let children = list.filter(value => value[pid] !== null && value[pid] !== undefined && value[pid] != 0 && value[pid] !== '' && value[pid] !== '#' && value[pid] !== '*')
    const translator = (parents, children) => {
      parents.forEach(parent => {
        if (tree) {
          parent.expand = true
          parent.title = parent.name || 'null'
        }
        children.forEach((current, index) => {
          if (current[pid] === parent[id]) {
            let temp = [...children]
            temp.splice(index, 1)
            translator([current], temp)
            if (tree) {
              current.title = current.name || 'null'
            }
            typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
          }
        })
      })
    }
    translator(parents, children)
    if (tree) {
      return [{
        id: '0',
        title: '全部',
        expand: true,
        selected: true,
        children: parents
      }]
    } else {
      return parents
    }
  }
}

export const setSelectTreeById = (list, id) => {
  const eachChildren = children => {
    for (let i = 0; i < children.length; i++) {
      if (children[i].id == id) {
        children[i].selected = true
      } else {
        children[i].selected = false
      }
      if (children[i].children && Array.isArray(children[i].children)) {
        eachChildren(children[i].children)
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].id == id) {
      list[i].selected = true
    } else {
      list[i].selected = false
    }
    if (list[i].children && Array.isArray(list[i].children)) {
      eachChildren(list[i].children)
    }
  }
}

export const setSelectTreeByOwn = (list, own) => {
  const eachChildren = children => {
    for (let i = 0; i < children.length; i++) {
      if (children[i].own == own) {
        children[i].selected = true
        children[i].checked = true
      }
      if (children[i].children && Array.isArray(children[i].children)) {
        eachChildren(children[i].children)
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].own == own) {
      list[i].selected = true
    } else {
      list[i].selected = false
    }
    if (list[i].children && Array.isArray(list[i].children)) {
      eachChildren(list[i].children)
    }
  }
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// ---------------------------------

export const TOKEN_KEY = 'token'

export const MENU_KEY = 'menu'

export const PERISSIONS_KEY = 'permissions'

export const formatMenu = menu => {
  let addList = []
  const eachMenu = list => {
    list.forEach(item => {
      addList.push({
        id: item.id,
        pid: item.parentId,
        path: item.url,
        name: item.url.substr(1, item.url.length),
        component: () => {
          if (item.parentId == 0) {
            // 一级菜单头
            // return import('@/components/main')
          } else if (item.parentId != 0 && item.subMenus.length !== 0) {
            // 二级菜单头
            // return import('@/components/parent-view')
          } else {
            let filePath = item.url
            const getFilePath = pid => {
              const rt = addList.find(r => r.id == pid)
              if (!rt) return
              filePath = rt.path + filePath
              if (rt.pid != 0) {
                getFilePath(rt.pid)
              }
            }
            getFilePath(item.parentId)
            filePath = filePath.substr(1, filePath.length)
            // return import(`@/view/${filePath}.vue`)
          }
        },
        meta: {
          icon: item.icon,
          title: item.name,
          showAlways: item.parentId != 0 && item.subMenus.length !== 0
        }
      })
      eachMenu(item.subMenus)
    })
  }
  eachMenu(menu)
  return buildTree(addList, 'id', 'pid', false)
}

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}
export const setHasLogin = (hasLogin) => {
  Cookies.set(HAS_LOGIN, hasLogin, { expires: cookieExpires || 1 })
}

export const getHasLogin = () => {
  const hasLogin = Cookies.get(HAS_LOGIN)
  if (hasLogin) return hasLogin
  else return false
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta && homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta,
      path: item.path
    }
    if (obj.meta && !obj.meta.title) {
      delete obj.meta
    }
    return obj
  })
  res = res.filter((item, index, self) => {
    if (index !== (res.length - 1)) {
      item['to'] = item.path
    }
    return item.meta && !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = { ...route
  }
  let meta = { ...route.meta
  }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let {
    title,
    __titleIsFunction__
  } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @description 本地存储和获取分类数据列表
 */
export const setCategoryListInLocalstorage = list => {
  localStorage.categoryList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的categoryId, parentId, categoryName
 */
export const getCategoryListFromLocalstorage = () => {
  const list = localStorage.categoryList
  return list ? JSON.parse(list) : []
}
/**
 * @description 本地存储和获取的首页Banner列表
 */
export const setIndexBannerListInLocalstorage = list => {
  localStorage.indexBannerList = JSON.stringify(list)
}
/**
 * 获取本地存储的首页Banner列表
 */
export const getIndexBannerListInLocalstorage = () => {
  const list = localStorage.indexBannerList
  return list ? JSON.parse(list) : []
}
/**
 * 产品列表数据缓存
 */
export const setProMapListInLocalstorage = (map) => {
  localStorage.proMapList = JSON.stringify(map)
}

/**
 * 产品列表数据缓存, 如果传入参数则返回对应的列表数据，如果不传则返回所有Map
 */
export const getProListInLocalstorage = (key) => {
  const map = localStorage.proMapList
  if (key) {
    return map ? JSON.parse(map)[key] : []
  } else {
    return map ? JSON.parse(map) : {}
  }
}

/**
 * @description 热门礼品
 */
export const setIndexHotProListInLocalstorage = list => {
  localStorage.indexHotProList = JSON.stringify(list)
}
/**
 * 获取本地存储的首页热门礼品列表
 */
export const getIndexHotProListInLocalstorage = () => {
  const list = localStorage.indexHotProList
  return list ? JSON.parse(list) : []
}
/**
 * 设置本地存储的收货地址
 */
export const setReceiverAddressListInLocalstorage = list => {
  localStorage.receiverAddressList = JSON.stringify(list)
}
/**
 * 获取本地存储的收货地址列表
 */
export const getReceiverAddressListInLocalstorage = () => {
  const list = localStorage.receiverAddressList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = config.homeName) => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else {
 newList.push({
    name,
    path,
    meta
  })
}
  return newList
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}
