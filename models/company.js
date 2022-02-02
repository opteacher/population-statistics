import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'company',
  name:         db.PropTypes.String,
  shopName:     db.PropTypes.String,
  type:         db.PropTypes.String,// 企业公司/金融证券/餐饮/美容美发/医疗机构/健身房/教育培训/宾旅馆/中介/养身按摩/便利超市/其他
  regId:        db.PropTypes.String,
  address:      db.PropTypes.String,
  area:         db.PropTypes.Number,
  lglName:      db.PropTypes.String,
  lglId:        db.PropTypes.String,
  lglPhone:     db.PropTypes.String,
  openHours:    db.PropTypes.String,// 00:00-24:59
  isClosed:     db.PropTypes.Boolean,
  fireFgtTags:  db.PropTypes.String,
  pbcSecuTags:  db.PropTypes.String,
  remarks:      db.PropTypes.String,
  pictures:     db.PropTypes.String,// 存储图片表的ID
  license:      db.PropTypes.String,
}, {
  router: {
    methods: ['GET', 'ALL', 'POST', 'PUT', 'DELETE']
  }
})
