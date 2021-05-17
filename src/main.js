import routes from "./routes"
import "./styles/common.scss"

Vue.router = new VueRouter({
  base: "/population-statistics/",
  mode: "history",
  routes
})

new Vue({
  template: "<router-view/>",
  router: Vue.router
}).$mount("#app")

export default routes.map(route => route.path)