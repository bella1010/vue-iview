
const PUBLIC_PATH = '/oa/'

const imgPath = {
  dev: '//10.1.100.59',
  test: '//10.1.100.59',
  pro: '//img.iceasy.com'
}

const baseConfig = {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'demo index',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  publicPath:PUBLIC_PATH,

  /**
   * @description 图片路径请求基础路径
   */
  imgBasePath: process.env.NODE_ENV === 'production'
    ? imgPath.pro
    : process.env.NODE_ENV==='test'
      ? imgPath.test
      : imgPath.dev,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'index',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'resize-window': {
      timeout: 3 // 屏幕大小变化后延时处理时间
    }
  }
}

export default baseConfig;
