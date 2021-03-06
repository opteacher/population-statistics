const db = require("../utils/tools").getDatabase()

module.exports = db.defineModel({
  __modelName: "company",
  name:         db.Types.String,
  shopName:     db.Types.String,
  type:         db.Types.String,// 企业公司/金融证券/餐饮/美容美发/医疗机构/健身房/教育培训/宾旅馆/中介/养身按摩/便利超市/其他
  regId:        db.Types.String,
  address:      db.Types.String,
  lglName:      db.Types.String,
  lglId:        db.Types.String,
  lglPhone:     db.Types.String,
  openHours:    db.Types.String,// 00:00-24:59
  isClosed:     db.Types.Boolean,
  hasLiving:    db.Types.Boolean,
  isAlgStreet:  db.Types.Boolean,
  hasStore:     db.Types.Boolean,
  useFire:      db.Types.Boolean,
  isTopBottom:  db.Types.Boolean,// 是否室高层或地下室
  sellAlcohol:  db.Types.Boolean,
  isSuspicious: db.Types.Boolean,
  suspiciousRmks: db.Types.String,
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