const Path = require("path")
const router = require("koa-router")()

const tools = require("../../../../../../utils/tools")
const pjPath = tools.projRootPath()
const sqlCfg = tools.readConfig(Path.join(pjPath, "configs", "sqls"))
const db = tools.getDatabase()

router.get("/total_count", async ctx => {
  ctx.body = {
    data: (await db.exec(tools.fmtQuerySQL(sqlCfg.selCompanyNum, ctx.query, "company", {
      addWhere: false, tags: ["fireFgtTags", "pbcSecuTags"]
    })))[0]
  }
})

router.get("/total_count/groupby/type", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selCompanyNumGpByType))[0]
  }
})

router.get("/total_count/open/night", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selCompanyNumOpnNgt))[0]
  }
})

module.exports = router