const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "report",
  type:     db.Types.String,// 房屋/单位/人员
  relId:    db.Types.Number,
  name:     db.Types.String,// 地址/店名/人名
  props:    db.Types.String,// 出错的分量（e.g：地址.错误/法人.错误/户籍地址.缺失）
  desc:     db.Types.String,
  submit:   db.Types.String,// 提交者
  sbtPhone: db.Types.String,// 提交者联系电话
  solved:   db.Types.Boolean,
}, {
  router: {
    methods: [
      "GET",
      "ALL",
      "POST",
      "PUT",
      "DELETE"
    ]
  }
})