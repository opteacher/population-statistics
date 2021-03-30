const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "record",
  type:       db.Types.String,// come/leave
  purpose:    db.Types.String,// work/live
  name:       db.Types.String,
  idCard:     db.Types.String,
  phone:      db.Types.String,
  lvAddress:  db.Types.String,
  toAddress:  db.Types.String
}, {
  router: {
    methods: [
      "GET",
      "ALL",
      "POST"
    ]
  }
})