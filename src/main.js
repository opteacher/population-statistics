import Vue from "vue"
import VueRouter from "vue-router"
import VueAxios from "vue-axios"
import axios from "axios"
import routes from "./routes"
import "./styles/common.scss"
import "mint-ui/lib/style.min.css"
import { Field, Button, Navbar, TabItem, TabContainer, TabContainerItem, Cell, CellSwipe, Search, Tabbar, Radio, Actionsheet, Header, Badge, Picker } from "mint-ui"

Vue.component(Field.name, Field)
Vue.component(Button.name, Button)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Cell.name, Cell)
Vue.component(CellSwipe.name, CellSwipe)
Vue.component(Search.name, Search)
Vue.component(Tabbar.name, Tabbar)
Vue.component(Radio.name, Radio)
Vue.component(Actionsheet.name, Actionsheet)
Vue.component(Header.name, Header)
Vue.component(Badge.name, Badge)
Vue.component(Picker.name, Picker)

Vue.use(VueRouter)
Vue.use(VueAxios, axios)
// Vue.axios.defaults.baseURL = "https://api-demo.websanova.com/api/v1"
Vue.router = new VueRouter({ routes })

new Vue({
  template: "<router-view/>",
  router: Vue.router
}).$mount("#app")

export default routes.map(route => route.path)