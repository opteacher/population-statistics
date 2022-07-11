module.exports = {
  lintOnSave: false,
  assetsDir: 'population-statistics-frt',
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
