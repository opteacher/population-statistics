const _ = require('lodash')
const path = require('path')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const tools = require('../utils/tools')
const db = tools.getDatabase()
const svrCfg = tools.readConfig(
  path.resolve(tools.projRootPath(), 'configs/server')
)

const exp = {
  async login (ctx, model, key) {
    const reqBody = ctx.request.body

    const result = await db.select(model, {
      [key]: reqBody[key]
    })
    if(!result.length) {
      ctx.body = { error: '用户名不存在' }
      return
    }
    const user = result[0]

    const reqPwd = crypto.createHmac('sha256', tools.getSecret())
      .update(reqBody.password).digest('hex')
    if (reqPwd !== user.password) {
      ctx.body = { error: '错误的登录密码' }
      return
    }

    const payload = {
      sub: 'login',
      aud: user.id,
      iat: Date.now(),
      jti: uuidv4(),
      iss: svrCfg.admin,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 1 day
    }
    let login = user
    delete login.password
    ctx.body = {
      data: {
        login,
        token: jwt.sign(payload, svrCfg.secret),
        message: '登录成功！'
      }
    }
  },
  async logstat (ctx) {
    const reqQuery = ctx.request.query

    const token = reqQuery.token
    if(!token) {
      ctx.body = { error: '未登录' }
      return
    }

    try {
      jwt.verify(token, svrCfg.secret)
    } catch (e) {
      ctx.body = {
        error: `登录token验证失败：${e.message || JSON.stringify(e)}`
      }
      return
    }

    ctx.body = {
      data: {
        message: '验证通过'
      }
    }
  },
  async regup (ctx, model, key) {
    const reqBody = ctx.request.body

    const stored = await db.select(model, {
      [key]: reqBody[key]
    })
    if (stored.length) {
      ctx.body = {
        error: '用户名已经存在'
      }
      return
    }

    const result = await db.save(model, reqBody)
    if(typeof result === "string") {
      ctx.body = {
        error: `持久化用户数据失败：${result}`
      }
    } else {
      ctx.body = {result}
    }
  }
}

module.exports = exp
