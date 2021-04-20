const _ = require("lodash")
const router = require("koa-router")()
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const uuidv4 = require("uuid/v4")
const ms = require("ms")
const Path = require("path")

const tools = require("../../../../../../utils/tools")
const projPath = tools.projRootPath()
const db = tools.getDatabase()
const { Person } = require(`${projPath}/models/index`)
const jwtCfg = tools.readConfig(Path.join(projPath, "configs", `jwt.${tools.env()}`))

router.post("/in", async ctx => {
  // @step{1}:收集请求参数
  let reqBody = ctx.request.body
  // @step{2}:查询数据库，判断用户身份
  let result = await db.select(Person, {
    idCard: reqBody.idCard
  })
  if(result.length !== 1) {
    ctx.body = {
      status: 400,
      message: "人员不存在"
    }
    return
  }
  let person = result[0]
  // @step{3}:检查密码
  if(person.name !== reqBody.name) {
    ctx.body = {
      status: 400,
      message: "人员信息错误"
    }
    return
  }
  // @step{4}:生成jwt填入response头部
  let payload = _.clone(jwtCfg)
  let secret = payload.secret
  let options = { expiresIn: payload.exp }
  delete payload.exp
  delete payload.secret
  payload.sub = reqBody.name
  payload.aud = reqBody.audience || "weixin"
  payload.iat = Date.now()
  payload.jti = uuidv4()
  let token = jwt.sign(payload, secret, options)
  ctx.set("authorization", token)
  // @step{5}:返回
  ctx.body = {
    status: 200,
    data: person,
    message: "登录成功"
  }
})

router.get("/stat", async ctx => {
  // @step{1}:从头部获取授权token
  let token = ctx.get("authorization")
  if(!token) {
    ctx.body = {
      status: 400,
      message: "未登录"
    }
    return
  }
  // @step{2}:验证token合法
  let payload = {
    issuer: jwtCfg.iss,
    audience: ctx.request.query.audience || "weixin"
  }
  let decoded = {}
  try {
    decoded = jwt.verify(token, jwtCfg.secret, payload)
  } catch (e) {
    ctx.body = {
      status: 400,
      message: `登录token验证失败：${e.message || JSON.stringify(e)}`
    }
    return
  }
  // @step{3}:获取token中的用户信息
  let result = "succeed"
  if(decoded.payload && decoded.payload.aud) {
    result = decoded.payload.aud
  }
  ctx.body = {
    status: 200,
    data: result,
    message: "验证通过"
  }
})

module.exports = router