const router = require('koa-router')()
const path = require('path')

const rootPath = require('../../../../../../utils/tools').projRootPath()
const { Admin } = require(path.resolve(rootPath, 'models/index'))
const { login, logstat } = require(path.resolve(rootPath, 'services/user'))

router.post('/in', ctx => login(ctx, Admin, 'username'))

router.get('/stat', ctx => logstat(ctx))

module.exports = router
