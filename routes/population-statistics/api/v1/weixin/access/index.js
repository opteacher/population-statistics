const _ = require("lodash")
const Path = require("path")
const router = require("koa-router")()
const crypto = require("crypto")

const tools = require("../../../../../../utils/tools")
const projPath = tools.projRootPath()
const env = tools.env()
const wxCfg = tools.readConfig(Path.join(projPath, "configs", `wx.${env}`))

router.get("/", async ctx => {
  if(!ctx.request.query) {
    ctx.throw(400, "weixin", "This's not a weixin request")
  }
  let query = ctx.request.query
  if(!query.signature || !query.timestamp || !query.nonce || !query.echostr) {
    ctx.throw(400, "weixin", "Lost one of signature or timestamp or nonce or echostr")
  }
  let sig = query.signature
  let tms = query.timestamp
  let noc = query.nonce
  let ecs = query.echostr
  let tkn = wxCfg.token

  let dat = [tkn, tms, noc].sort().join("")
  let hsh = crypto.createHash("sha1").update(dat).digest("hex")
  console.log(hsh)

  if(hsh === sig) {
    ctx.body = ecs
  } else {
    ctx.body = ""
  }
})

module.exports = router