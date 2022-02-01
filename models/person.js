import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'person',
  name:       db.Types.String,
  idCard:     db.Types.String,
  gender:     db.Types.String,
  nation:     db.Types.String,
  phone:      db.Types.String,
  hhAddress:  db.Types.String,
  lvAddress:  db.Types.String,
  hasLvCard:  db.Types.Boolean,
  cmpId:      db.Types.Number,
  company:    db.Types.String,
  specTags:   db.Types.String,
  remarks:    db.Types.String,
  idPicture:  db.Types.String,
  pictures:   db.Types.String,
}, {
  router: {
    methods: ['GET', 'ALL', 'POST', 'PUT', 'DELETE']
  }
})
