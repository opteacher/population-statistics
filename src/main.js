import routes from "./routes"
import "./styles/common.scss"

Vue.router = new VueRouter({ routes })

new Vue({
  template: "<router-view/>",
  router: Vue.router
}).$mount("#app")

export default routes.map(route => route.path)