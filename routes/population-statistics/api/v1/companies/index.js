const fs = require("fs")
const _ = require("lodash")
const stream = require("stream")
const ExcelJS = require("exceljs")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { Company, Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()
const excTmpPath = `${pjPath}/resources/companies_temp.xlsx`

router.post("/export/excel", async ctx => {
  const reqBody = ctx.request.body
  const cmpIds = reqBody.cmpIds instanceof Array ?
  reqBody.cmpIds.map(cmpId => parseInt(cmpId)) : [parseInt(reqBody.cmpIds)]
  let conds = {}
  if (reqBody.cmpIds) {
    conds.id = ["in", cmpIds]
  } else if (!reqBody.ctnHouses) {
    conds.shopName = ["!=", ""]
  }
  let companies = await db.select(Company, conds, {rawQuery: true})
  let houses = {}
  for (let i = 0; i < companies.length; ++i) {
    if (companies[i].shopName === "") {
      houses[i] = companies[i].address
    } else {
      companies[i].people = await db.select(Person, {
        cmpId: companies[i].id
      })
    }
  }
  for (const [hid, lvAddress] of Object.entries(houses)) {
    companies[hid].people = await db.select(Person, {lvAddress})
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.read(fs.createReadStream(excTmpPath))
  const worksheet = workbook.getWorksheet(1)

  let rowNum = 4
  for (const company of companies) {
    const count = company.people.length >= 2 ? company.people.length : 2
    worksheet.duplicateRow(rowNum, count, true)

    worksheet.getCell(`A${rowNum}`).value = company.id
    worksheet.getCell(`B${rowNum}`).value = `${company.name}（${company.shopName}）`
    worksheet.getCell(`C${rowNum}`).value = company.address
    worksheet.getCell(`A${rowNum + 1}`).value = company.lglName
    worksheet.getCell(`B${rowNum + 1}`).value = company.lglId
    worksheet.getCell(`C${rowNum + 1}`).value = company.lglPhone

    for (let i = 0; i < company.people.length; ++i) {
      const person = company.people[i]
      worksheet.getCell(`D${rowNum + i}`).value = person.id
      worksheet.getCell(`E${rowNum + i}`).value = person.name
      worksheet.getCell(`F${rowNum + i}`).value = person.idCard
      worksheet.getCell(`G${rowNum + i}`).value = person.phone
    }
    rowNum += count
  }

  const xlsxBuffer = await workbook.xlsx.writeBuffer()
  const bufferStream = new stream.PassThrough()
  const readableStream = bufferStream.end(xlsxBuffer)

  ctx.body = {
    data: await tools.uploadToQiniu(`导出单位${Date.now()}.xlsx`, readableStream)
  }
})

module.exports = router