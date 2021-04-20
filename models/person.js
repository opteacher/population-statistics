const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "person",
  name:       db.Types.String,
  idCard:     db.Types.String,
  gender:     db.Types.String,
  nation:     db.Types.String,
  phone:      db.Types.String,
  hhAddress:  db.Types.String,
  lvAddress:  db.Types.String,
  cmpId:      db.Types.Number,
  company:    db.Types.String,
  isLvAlnOld: db.Types.Boolean,
  isPregWman: db.Types.Boolean,
  hasMentalIllness: db.Types.Boolean,
  isDisability:     db.Types.Boolean,
  isSuspicious:     db.Types.Boolean,
  suspiciousRmks:   db.Types.String,
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