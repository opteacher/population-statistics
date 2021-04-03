const crypto = require("crypto")
const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "admin",
  username: db.Types.String,
  password: db.Types.String
}, {
  router: {
    methods: [
      "GET",
      "ALL",
      "POST",
    ]
  },
  middle: {
    create: {
      before: function(doc) {
        if(doc.password) {
          doc.password = crypto.createHash("sha1").update(doc.password).digest("hex");
        }
      }
    }
  }
})