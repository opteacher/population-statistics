const Path = require("path")
const router = require("koa-router")()

const tools = require("../../../../../../utils/tools")
const pjPath = tools.projRootPath()
const sqlCfg = tools.readConfig(Path.join(pjPath, "configs", "sqls"))
const db = tools.getDatabase()

router.get("/total_count", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selHouseNum))[0]
  }
})

module.exports = router