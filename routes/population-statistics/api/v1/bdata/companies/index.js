const Path = require("path")
const sequelize = require("sequelize")
const router = require("koa-router")()

const tools = require("../../../../../../utils/tools")
const pjPath = tools.projRootPath()
const sqlCfg = tools.readConfig(Path.join(pjPath, "configs", "sqls"))
const db = tools.getDatabase()

router.get("/total_count", async ctx => {
  let sql = sqlCfg.selCompanyNum.trim()
  switch (ctx.query.scope) {
    case "month":
      sql += " AND DATEDIFF(CURDATE(), `company`.`createdAt`) < 30"
      break
    case "year":
      sql += " AND DATEDIFF(CURDATE(), `company`.`createdAt`) < 365"
      break
  }
  ctx.body = {
    data: (await db.exec(sql))[0]
  }
})

router.get("/total_count/orderby/type", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selCompanyNumGpByType))[0]
  }
})

router.get("/total_count/is/closed", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selClosedCompanyNum))[0]
  }
})

router.get("/total_count/orderby/firfighting", async ctx => {
  const sqls = sqlCfg.selFFPoiCompanyNum.split(";")
  const result = await Promise.all(sqls.map(sql => db.exec(sql)))
  ctx.body = {
    data: Object.assign(
      result[0][0][0],
      result[1][0][0],
      result[2][0][0],
      result[3][0][0],
    )
  }
})

module.exports = router