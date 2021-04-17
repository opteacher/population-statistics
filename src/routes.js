import home from "./pages/home"
import come from "./pages/come"
import leave from "./pages/leave"
import valid from "./pages/valid"
import input from "./pages/input"
import list from "./pages/list"
import cmpDetail from "./pages/cmpDetail"
import psnDetail from "./pages/psnDetail"
import login from "./pages/login"
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
    path: "/population-statistics/valid",
    component: valid
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
    path: "/population-statistics/login",
    component: login
}, {
    path: "/population-statistics/admin",
    component: admin
}]