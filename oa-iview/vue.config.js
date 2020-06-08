const path = require('path')
const PUBLISH_PATH = './dist/pshop';

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = '/pshop/';

//后台服务器的ip地址
const targetConfig = {
  ucenter : process.env.NODE_ENV === 'production'?'http://www.iceasy.com':process.env.NODE_ENV==='test'?'http://10.1.100.94:8090':'http://10.1.100.94:8090',
  pshop : process.env.NODE_ENV === 'production'?'http://10.10.10.151:8088':process.env.NODE_ENV==='test'?'http://10.1.100.94:8088':'http://10.1.100.94:8088'
}
// const targetConfig = {
//   ucenter : process.env.NODE_ENV === 'production'?'http://www.iceasy.com':process.env.NODE_ENV==='test'?'http://10.1.100.94:8090':'http://10.1.100.94:8090',
//   pshop : process.env.NODE_ENV === 'production'?'http://www.iceasy.com':process.env.NODE_ENV==='test'?'http://www.iceasy.com':'http://www.iceasy.com'
// }

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  transpileDependencies: ['iview'],
  chainWebpack: config => {
    // config
    //   .entry('polyfill')
    //   .add('@babel/polyfill')

    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_a', resolve('src/assets'))
  },
  css: {
    loaderOptions: { // 向CSS相关的loader传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/ucenter': {
        target: targetConfig.ucenter, //后台服务器的ip地址
        pathRewrite: { '^/ucenter': '/ucenter' },
        changeOrigin: true
      },
      '/api/pshop': {
        target: targetConfig.pshop, //后台服务器的ip地址
        pathRewrite: { '^/api/pshop': '/api/pshop' },
        changeOrigin: true
      }
    }
  },


  // 编译后输出的路径
  outputDir:PUBLISH_PATH
}
