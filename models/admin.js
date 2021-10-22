const crypto = require("crypto")
const tools = require("../utils/tools")
const db = tools.getDatabase()
const secret = tools.getSecret()

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
        if(doc.password.length !== 64) {
          doc.password = crypto
            .createHmac("sha256", secret)
            .update(doc.password)
            .digest("hex")
        }
      }
    }
  }
})
