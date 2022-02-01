import fs from 'fs'
import Path from 'path'
import stream from 'stream'
import ExcelJS from 'exceljs'
import Router from 'koa-router'

import { db } from '../../../../../utils/index.js'
import Company from '../../../../../models/company.js'
import Person from '../../../../../models/person.js'
import { uploadToQiniu } from '../../../../../services/cdn.js'

const router = Router()
const excTmpPath = Path.resolve('../../../../..', 'resources')

router.get('/:cmpId/export/excel', async ctx => {
  const result = await db.select(Company, {
    id: ctx.params.cmpId
  })
  const company = result[0]
  const employees = await db.select(Person, {
    cmpId: company.id
  })

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.read(fs.createReadStream(Path.join(excTmpPath, 'company_temp.xlsx')))

  const worksheet = workbook.getWorksheet(1)
  worksheet.getCell('A3').value = company.name ? `${company.name}（${company.shopName}）` : company.shopName
  worksheet.getCell('D3').value = company.regId
  worksheet.getCell('E3').value = company.address
  worksheet.getCell('F3').value = company.lglName
  worksheet.getCell('G3').value = company.lglPhone
  worksheet.getCell('H3').value = company.lglId

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
    data: await uploadToQiniu(`${company.shopName}.xlsx`, readableStream)
  }
})

export default router
