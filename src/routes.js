import home from "./pages/home.vue"
import list from "./pages/list"
import cmpDetail from "./pages/cmpDetail"
import psnDetail from "./pages/psnDetail"
import admin from "./pages/admin"

export default [{
    path: "/",
    redirect: "/population-statistics/home"
}, {
    path: "/population-statistics/home",
    component: home
}, {
    path: "/population-statistics/list",
    component: list
}, {
    path: "/population-statistics/company-detail",
    component: cmpDetail
}, {
    path: "/population-statistics/person-detail",
    component: psnDetail
}, {
    path: "/population-statistics/admin",
    component: admin
}]