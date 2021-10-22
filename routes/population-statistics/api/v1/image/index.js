const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

const tools = require("../../../../../utils/tools")
const pjPath = tools.projRootPath()
const { uploadToQiniu } = require(`${pjPath}/services/cdn`)
const { Image } = require(`${pjPath}/models/index`)
const db = tools.getDatabase()

router.post('/', async ctx => {
  const key = ctx.request.body.key
    || path.parse(ctx.request.files.file.path).base
  const url = await uploadToQiniu(key,
    fs.createReadStream(ctx.request.files.file.path)
  )
  const newOne = await db.save(Image, { url })
  ctx.body = {
    data: {
      id: newOne.id, url
    }
  }
})

module.exports = router
