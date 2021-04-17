const Path = require("path")
const router = require("koa-router")()

const tools = require("../../../../../../utils/tools")
const pjPath = tools.projRootPath()
const sqlCfg = tools.readConfig(Path.join(pjPath, "configs", "sqls"))
const db = tools.getDatabase()

router.get("/number-of-people", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selPersonNum))[0]
  }
})

module.exports = router