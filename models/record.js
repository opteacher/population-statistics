import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'record',
  type:       db.Types.String,// come/leave
  purpose:    db.Types.String,// work/live
  psnId:      db.Types.Number,
  name:       db.Types.String,
  idCard:     db.Types.String,
  gender:     db.Types.String,
  nation:     db.Types.String,
  phone:      db.Types.String,
  lvAddress:  db.Types.String,
  hhAddress:  db.Types.String,
  hasLvCard:  db.Types.Boolean,
  toAddress:  db.Types.String,
  cmpId:      db.Types.Number,
  company:    db.Types.String,
  passed:     db.Types.Boolean,// 是否审批通过
  submit:     db.Types.String// 提交者
}, {
  router: {
    methods: ['GET', 'ALL', 'POST', 'PUT', 'DELETE']
  }
})
