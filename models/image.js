import { db } from '../utils/index.js'

export default db.defineModel({
  __modelName: 'image',
  url: db.Types.String,
}, {
  router: {
    methods: ['GET', 'POST', 'DELETE']
  }
})
