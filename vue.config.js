const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    open: true,
    // 开启代理，处理跨域
    proxy: {
      '/dev-api': {  // 凡是'/dev-api'开头的请求都要跨域
        target: 'http://sph-h5-api.atguigu.cn', // 让开发服务器转发的目标地址
        changeOrigin: true,  // 允许跨域
        pathRewrite: {
          '^/dev-api': '',   // 路径重写，因为路径是以'/dev-api'开头的就是要跨域，让开发服务器转发的时候把
                             // '/dev-api'这个去掉再发请求，不然接口对不上
        },
      },
    },
  },
})
