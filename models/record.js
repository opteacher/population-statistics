const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "record",
  type:       db.Types.String,// come/leave
  purpose:    db.Types.String,// work/live
  psnId:      db.Types.Number,
  name:       db.Types.String,
  idCard:     db.Types.String,
  phone:      db.Types.String,
  lvAddress:  db.Types.String,
  hhAddress:  db.Types.String,
  toAddress:  db.Types.String,
  cmpId:      db.Types.Number,
  passed:     db.Types.Boolean// 是否审批通过
}, {
  router: {
    methods: [
      "GET",
      "ALL",
      "POST",
      "PUT",
    ]
  }
})