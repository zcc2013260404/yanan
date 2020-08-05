'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {// dev 环境
		env: require('./dev.env'),// 使用 config/dev.env.js 中定义的编译环境
    // Paths
    assetsSubDirectory: 'static', // 编译输出的二级目录
    assetsPublicPath: './',// 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    proxyTable: {},//需要 proxyTable 代理的接口（可跨域）

    // Various Dev Server settings
   	host: 'localhost', // can be overwritten by process.env.HOST
//  host: '192.168.2.51', // can be overwritten by process.env.HOST
    port: 8000, // 运行测试页面的端口
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    /**
     * Source Maps
     */
    //https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    autoOpenBrowser: true,
    cssSourceMap: false,
    proxyTable: {
        '/api': {
            target: '', //配置地址
            changeOrigin: true, //允许跨域
            pathRewrite: { //需要rewrite重写的, 如果在服务器端做了处理则可以不要这段
                '^/api': '/'
            }
        }
    },
  },

  build: {// production 环境
    env: require('./prod.env'),// 使用 config/prod.env.js 中定义的编译环境
    index: path.resolve(__dirname, '../dist/index.html'),// 编译输入的 index.html 文件
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),// 编译输出的静态资源路径
    assetsSubDirectory: 'static',// 编译输出的二级目录
    assetsPublicPath: './',// 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    productionSourceMap: false,//是否开启 cssSourceMap
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
