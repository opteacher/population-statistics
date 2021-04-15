import home from "./pages/home"
import come from "./pages/come"
import leave from "./pages/leave"
import people from "./pages/people"
import input from "./pages/input"
import list from "./pages/list"
import cmpDetail from "./pages/cmpDetail"
import psnDetail from "./pages/psnDetail"
import admin from "./pages/admin"
import approve from "./pages/approve"

export default [{
    path: "/",
    redirect: "/population-statistics/home"
}, {
    path: "/population-statistics/home",
    component: home
}, {
    path: "/population-statistics/come",
    component: come
}, {
    path: "/population-statistics/leave",
    component: leave
}, {
    path: "/population-statistics/people",
    component: people
}, {
    path: "/population-statistics/input",
    component: input
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
    path: "/population-statistics/approve",
    component: approve
}, {
    path: "/population-statistics/admin",
    component: admin
}]