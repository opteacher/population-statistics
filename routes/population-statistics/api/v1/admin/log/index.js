import Router from 'koa-router'

import Admin from '../../../../../../models/admin.js'
import { login, logstat } from '../../../../../../services/user.js'

const router = Router()

router.post('/in', ctx => login(ctx, Admin, 'username'))

router.get('/stat', ctx => logstat(ctx))

export default router
