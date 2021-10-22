import routes from "./routes"
import "./styles/common.less"
import VueHolder from 'vue-holderjs'
import { reqBackend } from './utils'
import store from './store'

Vue.use(VueHolder)

Vue.router = new VueRouter({
  base: "/population-statistics/",
  mode: "history",
  routes
})

async function validLogin (role) {
  const path = `/population-statistics/api/v1/${role}/log/stat`
  await reqBackend(axios.get(path, {
    params: { token: store.getters.lgnToken }
  }))
  return Promise.resolve()
}

Vue.router.beforeEach(async (to, _from, next) => {
  if (to.matched.some(record => record.meta.reqAdmin)) {
    try {
      await validLogin('admin')
      next()
    } catch (e) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
          error,
          mode: 'admin'
        }
      })
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

new Vue({
  template: "<router-view/>",
  router: Vue.router,
  store
}).$mount("#app")

export default routes.map(route => route.path)
