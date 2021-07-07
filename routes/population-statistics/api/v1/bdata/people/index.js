const Path = require("path")
const router = require("koa-router")()

const tools = require("../../../../../../utils/tools")
const pjPath = tools.projRootPath()
const sqlCfg = tools.readConfig(Path.join(pjPath, "configs", "sqls"))
const { Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()

router.get("/total_count", async ctx => {
  ctx.body = {
    data: (await db.exec(tools.fmtQuerySQL(sqlCfg.selPersonNum, ctx.query, "person", {
      tags: ["specTags"]
    })))[0]
  }
})

router.get("/total_count/groupby/company", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selPersonNumGpByCompany))[0]
  }
})


router.get("/total_count/groupby/house", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selPersonNumGpByHouse))[0]
  }
})

router.get("/total_count/living_and_working", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selPersonNumLvAndWk))[0]
  }
})

router.get("/total_count/groupby/nation", async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selPersonNumGpByNation))[0]
  }
})

router.get("/total_count/groupby/age", async ctx => {
  const people = await db.select(Person, {})
  let data = {
    "1-18": 0,
    "18-30": 0,
    "30-50": 0,
    "50-70": 0,
    "70+": 0,
  }
  for (let person of people) {
    if (!person.idCard) {
      continue
    }
    const bornYear = parseInt(person.idCard.slice(6, 10))
    const nowYear = (new Date()).getFullYear()
    const yearDiff = nowYear - bornYear
    if (yearDiff < 18) {
      data["1-18"]++
    } else if (yearDiff >= 18 && yearDiff < 30) {
      data["18-30"]++
    } else if (yearDiff >= 30 && yearDiff < 50) {
      data["30-50"]++
    } else if (yearDiff >= 50 && yearDiff < 70) {
      data["50-70"]++
    } else {
      data["70+"]++
    }
  }
  ctx.body = {data}
})

module.exports = router