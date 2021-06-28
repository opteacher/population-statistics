const fs = require("fs")
const stream = require("stream")
const ExcelJS = require("exceljs")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { Company, Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()
const excTmpPath = `${pjPath}/resources/company_temp.xlsx`

router.get("/:cmpId/export/excel", async ctx => {
  const result = await db.select(Company, {
    id: ctx.params.cmpId
  })
  const company = result[0]
  const employees = await db.select(Person, {
    cmpId: company.id
  })

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.read(fs.createReadStream(excTmpPath))

  const worksheet = workbook.getWorksheet(1)
  worksheet.getCell("A3").value = company.name ? `${company.name}（${company.shopName}）` : company.shopName
  worksheet.getCell("D3").value = company.regId
  worksheet.getCell("E3").value = company.address
  worksheet.getCell("F3").value = company.lglName
  worksheet.getCell("G3").value = company.lglPhone
  worksheet.getCell("H3").value = company.lglId

  if (employees.length > 0) {
    const count = employees.length > 15 ? employees.length : 15
    worksheet.duplicateRow(5, count - 1, false)
    for (let i = 0; i < count; ++i) {
      const colIdx = i + 5
      if (i !== 0) {
        worksheet.mergeCells(`E${colIdx}:F${colIdx}`)
      }
      worksheet.getCell(`A${colIdx}`).value = i + 1
      if (i >= employees.length) {
        continue
      }
      const employee = employees[i]
      worksheet.getCell(`B${colIdx}`).value = employee.name
      worksheet.getCell(`C${colIdx}`).value = employee.idCard
      worksheet.getCell(`D${colIdx}`).value = employee.lvAddress
      worksheet.getCell(`E${colIdx}`).value = employee.hhAddress
      worksheet.getCell(`G${colIdx}`).value = employee.phone
    }
  }

  const xlsxBuffer = await workbook.xlsx.writeBuffer()
  const bufferStream = new stream.PassThrough()
  const readableStream = bufferStream.end(xlsxBuffer)

  ctx.body = {
    data: await tools.uploadToQiniu(`${company.shopName}.xlsx`, readableStream)
  }
})

module.exports = router