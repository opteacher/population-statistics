const fs = require("fs")
const stream = require("stream")
const ExcelJS = require("exceljs")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()
const dataPath = `${pjPath}/resources/福海路777弄.xlsx`

function chkHeader (ctx, worksheet) {
  const hdInfo = {
    has: false,
    map: {
      name: "A",
      idCard: "B",
      gender: "C",
      nation: "D",
      lvAddress: "E"
    }
  }
  if (!ctx.query) {
    return hdInfo
  }
  const first = worksheet.getCell("A1").value
  if (first === "姓名") {
    hdInfo.has = true
  } else {
    return hdInfo
  }
  const hdRow = worksheet.getRow(1)
  hdRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
    if (ctx.query.name && ctx.query.name === cell.value) {
      hdInfo.map.name = String.fromCharCode(64 + colNum)
    }
    if (ctx.query.idCard && ctx.query.idCard === cell.value) {
      hdInfo.map.idCard = String.fromCharCode(64 + colNum)
    }
    if (ctx.query.gender && ctx.query.gender === cell.value) {
      hdInfo.map.gender = String.fromCharCode(64 + colNum)
    }
    if (ctx.query.nation && ctx.query.nation === cell.value) {
      hdInfo.map.nation = String.fromCharCode(64 + colNum)
    }
    if (ctx.query.hhAddress && ctx.query.hhAddress === cell.value) {
      hdInfo.map.hhAddress = String.fromCharCode(64 + colNum)
    }
    if (ctx.query.lvAddress && ctx.query.lvAddress === cell.value) {
      hdInfo.map.lvAddress = String.fromCharCode(64 + colNum)
    }
  })
  return hdInfo
}

function fixGender (row, genderIdx) {
  return row.getCell(genderIdx).value.replace("性", "")
}

function fixAddress (row, addrIdx) {
  if (!addrIdx) {
    return null
  }
  const orgAddr = row.getCell(addrIdx).value
  let address = ""
  if (!orgAddr) {
    return null
  } else if (orgAddr.richText) {
    for (const lvAddr of orgAddr.richText) {
      address += lvAddr.text
    }
  } else if (typeof orgAddr === "string") {
    address = orgAddr
  }
  address = address.replace("嘉定工业区", "")
  return address
}

router.post("/batch_load", async ctx => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.read(fs.createReadStream(dataPath))

  let count = 0
  for (const worksheet of workbook.worksheets) {
    const hdInfo = chkHeader (ctx, worksheet)
    worksheet.eachRow(async (row, rowNum) => {
      if (hdInfo.has && rowNum === 1) {
        return
      }
      const hdMap = hdInfo.map
      const cellA = row.getCell(hdMap.name)
      const name = cellA.value
      if (!name || typeof name !== "string") {
        return
      }
      let hasLvCard = false
      if (cellA.fill.bgColor) {
        if (cellA.fill.bgColor.indexed === 64) {
          hasLvCard = true
        }
      }
      const idCard = row.getCell(hdMap.idCard).value
      const gender = fixGender(row, hdMap.gender)
      const nation = row.getCell(hdMap.nation).value
      const lvAddress = fixAddress(row, hdMap.lvAddress)
      const hhAddress = fixAddress(row, hdMap.hhAddress)
      count++
      // console.log(name, idCard, gender, nation, lvAddress, hhAddress, hasLvCard)
      await db.save(Person, {
        name, idCard, gender, nation, lvAddress, hhAddress, hasLvCard
      })
    })
  }

  ctx.body = {
    data: count
  }
})

const colMapper = {
  name:       "姓名",
  idCard:     "身份证",
  gender:     "性别",
  nation:     "民族",
  phone:      "手机号",
  hhAddress:  "户籍地址",
  lvAddress:  "居住地址",
  company:    "工作单位"
}

router.post("/export/excel", async ctx => {
  const people = await db.select(Person, {
    id: ["in", ctx.request.body.psnIds.map(sid => parseInt(sid))]
  }, {
    selCols: ctx.request.body.columns
  })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet()
  worksheet.horizontalCentered = true

  const columns = ctx.request.body.columns.concat(ctx.request.body.addCols)
  worksheet.columns = columns.map(column => ({
    key: column,
    header: colMapper[column] || column
  }))
  const header = worksheet.getRow(1)
  header.height = 20

  for (let i = 0; i < people.length; ++i) {
    const person = people[i]
    worksheet.addRow(person, "i")
    if (i === 0) {
      const firstRow = worksheet.getRow(2)
      firstRow.height = 15
    }
  }
  for (let i = 0; i < worksheet.columnCount; ++i) {
    let maxWidth = 0
    const column = worksheet.columns[i]
    for (let j = 0; j < column.values.length; ++j) {
      if (!column.values[j]) {
        continue
      }
      const colWidth = column.values[j].length
      if (colWidth > maxWidth) {
        maxWidth = colWidth
      }
    }
    column.width = maxWidth >= 10 ? maxWidth : 10
  }

  const xlsxBuffer = await workbook.xlsx.writeBuffer()
  const bufferStream = new stream.PassThrough()
  const readableStream = bufferStream.end(xlsxBuffer)

  ctx.body = {
    data: await tools.uploadToQiniu(`导出人员${Date.now()}.xlsx`, readableStream)
  }
})

module.exports = router