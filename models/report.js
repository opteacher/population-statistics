import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'report',
  type:     db.PropTypes.String,// 房屋/单位/人员
  relId:    db.PropTypes.Number,
  name:     db.PropTypes.String,// 地址/店名/人名
  props:    db.PropTypes.String,// 出错的分量（e.g：地址.错误/法人.错误/户籍地址.缺失）
  desc:     db.PropTypes.String,
  submit:   db.PropTypes.String,// 提交者
  sbtPhone: db.PropTypes.String,// 提交者联系电话
  solved:   db.PropTypes.Boolean,
}, {
  router: {
    methods: ['GET', 'ALL', 'POST', 'PUT', 'DELETE']
  }
})
