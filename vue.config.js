module.exports = {
  lintOnSave: false,
  publicPath: '/population-statistics',
  outputDir: 'dist/public/population-statistics',
  assetsDir: 'static',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'mint-ui': 'MINT', //注意element-ui的引用时纯大写
      axios: 'axios',
      lodash: '_',
    },
  },
}
