const fs = require("fs")
const ExcelJS = require('exceljs')
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

  worksheet.duplicateRow(5, employees.length - 1, false)
  for (let i = 0; i < employees.length; ++i) {
    const employee = employees[i]
    const colIdx = i + 5
    worksheet.getCell(`A${colIdx}`).value = i + 1
    worksheet.getCell(`B${colIdx}`).value = employee.name
    worksheet.getCell(`C${colIdx}`).value = employee.idCard
    worksheet.getCell(`D${colIdx}`).value = employee.lvAddress
    if (i !== 0) {
      worksheet.mergeCells(`E${colIdx}:F${colIdx}`)
    }
    worksheet.getCell(`E${colIdx}`).value = employee.hhAddress
    worksheet.getCell(`G${colIdx}`).value = employee.phone
  }

  const distExcPath = `${pjPath}/public/gen/${company.shopName}.xlsx`
  await workbook.xlsx.write(fs.createWriteStream(distExcPath))

  ctx.body = {
    data: `/gen/${company.shopName}.xlsx`
  }
})

module.exports = router