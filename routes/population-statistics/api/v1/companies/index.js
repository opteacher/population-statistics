const fs = require("fs")
const stream = require("stream")
const ExcelJS = require("exceljs")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { Company, Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()
const excTmpPath = `${pjPath}/resources/companies_temp.xlsx`

router.get("/export/excel", async ctx => {
  const cmpIds = ctx.query.cmpIds instanceof Array ?
    ctx.query.cmpIds.map(cmpId => parseInt(cmpId)) :
    [parseInt(ctx.query.cmpIds)]
  const conds = ctx.query.cmpIds ? {id: ["in", cmpIds]} : {shopName: ["!=", ""]}
  let companies = await db.select(Company, conds, {rawQuery: true})
  for (let i = 0; i < companies.length; ++i) {
    const people = await db.select(Person, {
      cmpId: companies[i].id
    })
    companies[i].people = people
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