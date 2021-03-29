const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "company",
  name:     db.Types.String,
  shopName: db.Types.String,
  regId:    db.Types.String,
  address:  db.Types.String,
  lglName:  db.Types.String,
  lglId:    db.Types.String,
  lglPhone: db.Types.String
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