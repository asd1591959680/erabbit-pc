const path = require('path')
module.exports = {
  lintOnSave: false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less'),
      ],
    },
  },
  //需要配置10kb下的图片打包成base64的格式
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("images")
  //     .use("url-loader")
  //     .loader("url-loader")
  //     .tap((options) => Object.assign(options, { limit: 10000 }));
  //   // 开启IP域名访问
  //   config.devServer.disableHostCheck(true);
  // },
}
