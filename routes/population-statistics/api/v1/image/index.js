import fs from 'fs'
import Path from 'path'
import Router from 'koa-router'

import { uploadToQiniu } from '../../../../../services/cdn.js'

const router = Router()

router.post('/', async ctx => {
  ctx.body = {
    data: {
      url: await uploadToQiniu(ctx.request.body.key
        || Path.parse(ctx.request.files.file.path).base,
        fs.createReadStream(ctx.request.files.file.path)
      )
    }
  }
})

export default router
