import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'person',
  name:       db.PropTypes.String,
  idCard:     db.PropTypes.String,
  gender:     db.PropTypes.String,
  nation:     db.PropTypes.String,
  phone:      db.PropTypes.String,
  hhAddress:  db.PropTypes.String,
  lvAddress:  db.PropTypes.String,
  hasLvCard:  db.PropTypes.Boolean,
  cmpId:      db.PropTypes.Number,
  company:    db.PropTypes.String,
  specTags:   db.PropTypes.Array,
  remarks:    db.PropTypes.String,
  idPicture:  db.PropTypes.Array,
  pictures:   db.PropTypes.Array,
}, {
  router: {
    methods: ['GET', 'ALL', 'POST', 'PUT', 'DELETE']
  }
})
