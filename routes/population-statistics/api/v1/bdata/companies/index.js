import Router from 'koa-router'

import { db } from '../../../../../../utils/index.js'
import { readConfig } from '../../../../../../lib/backend-library/utils/index.js'
import { fmtQuerySQL } from '../../../../../../lib/backend-library/databases/index.js'

const router = Router()
const sqlCfg = readConfig('./configs/sqls')

router.get('/total_count', async ctx => {
  ctx.body = {
    data: (await db.exec(fmtQuerySQL(sqlCfg.selCompanyNum, ctx.query, 'company', {
      addWhere: false, tags: ['fireFgtTags', 'pbcSecuTags']
    })))[0]
  }
})

router.get('/total_count/groupby/type', async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selCompanyNumGpByType))[0]
  }
})

router.get('/total_count/open/night', async ctx => {
  ctx.body = {
    data: (await db.exec(sqlCfg.selCompanyNumOpnNgt))[0]
  }
})

export default router
