import Router from 'koa-router'

import { login, logstat } from '../../../../../../services/user.js'
import Person from '../../../../../../models/person.js'

const router = Router()

router.post('/in', ctx => login(ctx, Person, 'idCard'))

router.get('/stat', ctx => logstat(ctx))

export default router
