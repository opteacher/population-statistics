const resolve = require('path').resolve
const { VueLoaderPlugin } = require('vue-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    bundle: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'public/population-statistics/dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.(css|less)$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      },
      {
        test: /\.(eot|ttf|woff(2)?|svg|svgz)$/,
        type: 'asset/inline'
      }
    ]
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin()
  ],
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'mint-ui': 'MINT', //注意element-ui的引用时纯大写
    'axios': 'axios',
    'lodash': '_',
  }
}
