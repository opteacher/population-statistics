import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'record',
  type:       db.PropTypes.String,// come/leave
  purpose:    db.PropTypes.String,// work/live
  psnId:      db.PropTypes.Number,
  name:       db.PropTypes.String,
  idCard:     db.PropTypes.String,
  gender:     db.PropTypes.String,
  nation:     db.PropTypes.String,
  phone:      db.PropTypes.String,
  lvAddress:  db.PropTypes.String,
  hhAddress:  db.PropTypes.String,
  hasLvCard:  db.PropTypes.Boolean,
  toAddress:  db.PropTypes.String,
  cmpId:      db.PropTypes.Number,
  company:    db.PropTypes.String,
  passed:     db.PropTypes.Boolean,// 是否审批通过
  submit:     db.PropTypes.String// 提交者
}, {
  router: {
    methods: ['GET', 'ALL', 'POST', 'PUT', 'DELETE']
  }
})
