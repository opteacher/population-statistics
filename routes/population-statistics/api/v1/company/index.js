const Path = require("path")
const fs = require("fs")
const stream = require("stream")
const ExcelJS = require("exceljs")
const qiniu = require("qiniu")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const qnCfg = tools.readConfig(Path.join(pjPath, "configs", "qiniu"))
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
  }

  const xlsxBuffer = await workbook.xlsx.writeBuffer()
  const bufferStream = new stream.PassThrough()
  const readableStream = bufferStream.end(xlsxBuffer)

  const key = `${company.shopName}.xlsx`
  const mac = new qiniu.auth.digest.Mac(qnCfg.accessKey, qnCfg.secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: `${qnCfg.bucket}:${key}`
  })
  const uploadToken = putPolicy.uploadToken(mac)

  const config = new qiniu.conf.Config()
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z2

  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  await new Promise((res, rej) => {
    formUploader.putStream(uploadToken, key, readableStream, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        rej(respErr)
      }
      if (respInfo.statusCode == 200) {
        res(respBody)
      } else {
        console.log(respInfo.statusCode)
        rej(respBody)
      }
    })
  })

  ctx.body = {
    data: `http://qrucjxcko.hn-bkt.clouddn.com/${key}`
  }
})

module.exports = router