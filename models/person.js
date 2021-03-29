const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "person",
  name:       db.Types.String,
  idCard:     db.Types.String,
  phone:      db.Types.String,
  hhAddress:  db.Types.String,
  lvAddress:  db.Types.String,
  cmpId:      db.Types.Id
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