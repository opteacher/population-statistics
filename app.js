import Path from 'path'
import Koa from 'koa'
import body from 'koa-body'
import json from 'koa-json'
import logger from 'koa-logger'
import statc from 'koa-static'
import views from 'koa-views'
import cors from 'koa2-cors'

import { genApiRoutes } from './lib/backend-library/router/index.js'
import { genMdlRoutes } from './lib/backend-library/models/index.js'
import { db } from './utils/index.js'

const router = await genApiRoutes(
  Path.resolve('routes')
)
const models = (await genMdlRoutes(
  db,
  Path.resolve('models'),
  Path.resolve('configs', 'models')
)).router

const app = new Koa()

// 跨域配置
app.use(cors({credentials: true}))

// 路径解析
app.use(body({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  },
  jsonLimit: '100mb',
  onError: function (err, ctx) {
    ctx.throw(`Error happened! ${err}`)
  }
}))

// json解析
app.use(json())

// 日志输出
app.use(logger())

// 指定静态目录
app.use(statc(Path.resolve('public')))

// 模型路由
app.use(models.routes(), models.allowedMethods())

// 指定页面目录
app.use(views(Path.resolve('./'), {extension: 'html'}));

// 路径分配
app.use(router.routes(), router.allowedMethods())

// 指定页面目录
app.use(async ctx => await ctx.render('index'))

app.listen(process.env.PORT || 3000)
