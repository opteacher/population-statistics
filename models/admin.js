import crypto from 'crypto'
import { db } from '../utils/index.js'
import { readConfig } from '../lib/backend-library/utils/index.js'

const secret = readConfig('./configs/server').secret

export default db.defineModel({
  __modelName: 'admin',
  username: db.Types.String,
  password: db.Types.String
}, {
  router: {
    methods: ['GET', 'ALL', 'POST']
  },
  middle: {
    create: {
      before: function(doc) {
        if(doc.password.length !== 64) {
          doc.password = crypto
            .createHmac('sha256', secret)
            .update(doc.password)
            .digest('hex')
        }
      }
    }
  }
})
