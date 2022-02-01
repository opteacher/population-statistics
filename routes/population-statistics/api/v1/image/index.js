import Router from 'koa-router'

import { db } from '../../../../../utils/index.js'
import { uploadToQiniu } from '../../../../../services/cdn.js'
import Image from '../../../../../models/image.js'

const router = Router()

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

export default router
