const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "image",
  url: db.Types.String,
}, {
  router: {
    methods: [
      "GET",
      "POST",
      "DELETE"
    ]
  }
})
