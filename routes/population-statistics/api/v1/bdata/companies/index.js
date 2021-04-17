const Path = require("path")
const router = require("koa-router")()

const tools = require("../../../../../../utils/tools")
const pjPath = tools.projRootPath()
const sqlCfg = tools.readConfig(Path.join(pjPath, "configs", "sqls"))
const db = tools.getDatabase()

router.get("/number-of-companies", async ctx => {
  let sql = ""
  switch (ctx.query.scope) {
    case "month":
      sql = sqlCfg.selCompanyNumInOneMonth
      break
    case "year":
      sql = sqlCfg.selCompanyNumInOneYear
      break
    default:
      sql = sqlCfg.selCompanyNum
      break
  }
  ctx.body = {
    data: (await db.exec(sql))[0]
  }
})

module.exports = router