import Router from 'koa-router'

import { db } from '../../../../../utils/index.js'
import { readConfig } from '../../../../../lib/backend-library/utils/index.js'

const router = Router()
const sqlCfg = readConfig('./configs/sqls')

router.get('/people', async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selHouseWithPersonNum))[0]
  }
})

export default router
