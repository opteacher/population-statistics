const fs = require("fs")
const ExcelJS = require("exceljs")
const router = require("koa-router")()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { Person } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()
const dataPath = `${pjPath}/resources/福海路777弄.xlsx`

router.post("/batch_load", async ctx => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.read(fs.createReadStream(dataPath))

  let count = 0
  for (const worksheet of workbook.worksheets) {
    for (let i = 1; ; ++i) {
      const cellA = worksheet.getCell(`A${i}`)
      let hasLvCard = false
      if (cellA.fill.bgColor) {
        if (cellA.fill.bgColor.indexed === 64) {
          hasLvCard = true
        }
      }
      const name = cellA.value
      if (!name || name === "姓名") {
        break
      }
      const idCard = worksheet.getCell(`B${i}`).value
      let gender = worksheet.getCell(`C${i}`).value
      gender = gender.replace("性", "")
      const nation = worksheet.getCell(`D${i}`).value
      const lvAddrAry = worksheet.getCell(`E${i}`).value
      let lvAddress = ""
      for (const lvAddr of lvAddrAry.richText) {
        lvAddress += lvAddr.text
      }
      lvAddress = lvAddress.replace("嘉定工业区", "")
      count++
      // console.log(name, idCard, gender, nation, lvAddress, hasLvCard)
      await db.save(Person, {
        name, idCard, gender, nation, lvAddress, hasLvCard
      })
    }
  }

  ctx.body = {
    data: count
  }
})

module.exports = router