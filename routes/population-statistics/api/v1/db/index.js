const fs = require("fs")
const stream = require("stream")
const ExcelJS = require("exceljs")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { Company, Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()

router.put("/batch/tags", async ctx => {
  let companies = []
  for (const company of await db.select(Company, {
    shopName: ["!=", ""]
  })) {
    let fireFgtTags = []
    if (company.hasLiving) {
      fireFgtTags.push("店住人")
    }
    if (company.isAlgStreet) {
      fireFgtTags.push("沿街")
    }
    if (company.hasStore) {
      fireFgtTags.push("有仓库")
    }
    if (company.useFire) {
      fireFgtTags.push("用明火")
    }
    if (company.isTopBottom) {
      fireFgtTags.push("高层/地下室")
    }
    let pbcSecuTags = []
    if (company.sellAlcohol) {
      pbcSecuTags.push("销售酒类")
    }
    if (company.sellAlcohol) {
      pbcSecuTags.push("可疑行径")
    }
    companies.push(await db.save(Company, {
      fireFgtTags: fireFgtTags.join(","),
      pbcSecuTags: pbcSecuTags.join(",")
    }, {id: company.id}))
  }
  let people = []
  for (const person of await db.select(Person)) {
    let specTags = []
    if (person.isLvAlnOld) {
      specTags.push("独居老人")
    }
    if (person.isPregWman) {
      specTags.push("孕妇")
    }
    if (person.hasMentalIllness) {
      specTags.push("患精神疾病")
    }
    if (person.isDisability) {
      specTags.push("生理残疾人")
    }
    if (person.isDisability) {
      specTags.push("行径可疑")
    }
    people.push(await db.save(Person, {
      specTags: specTags.join(",")
    }, {id: person.id}))
  }
  ctx.body = {
    data: {companies, people}
  }
})

module.exports = router