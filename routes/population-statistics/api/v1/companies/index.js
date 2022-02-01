import fs from 'fs'
import _ from 'lodash'
import Path from 'path'
import stream from 'stream'
import ExcelJS from 'exceljs'
import Router from 'koa-router'

import { db } from '../../../../../utils/index.js'
import Company from '../../../../../models/company.js'
import Person from '../../../../../models/person.js'
import { uploadToQiniu } from '../../../../../services/cdn.js'

const router = Router()
const excTmpPath = Path.resolve('../../../..', 'resources')

router.post('/export/excel', async ctx => {
  const reqBody = ctx.request.body
  const cmpIds = reqBody.cmpIds instanceof Array ?
  reqBody.cmpIds.map(cmpId => parseInt(cmpId)) : [parseInt(reqBody.cmpIds)]
  const conds = {}
  if (reqBody.cmpIds) {
    conds.id = ['in', cmpIds]
  } else if (!reqBody.ctnHouses) {
    conds.shopName = ['!=', '']
  }
  const companies = await db.select(Company, conds, {rawQuery: true})
  const houses = {}
  for (let i = 0; i < companies.length; ++i) {
    if (companies[i].shopName === '') {
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
  await workbook.xlsx.read(fs.createReadStream(Path.join(excTmpPath, 'companies_temp.xlsx')))
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
    data: await uploadToQiniu(`导出单位${Date.now()}.xlsx`, readableStream)
  }
})

export default router
