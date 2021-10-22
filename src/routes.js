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
  redirect: "/home"
}, {
  path: "/home",
  component: home
}, {
  path: "/come",
  component: come
}, {
  path: "/leave",
  component: leave
}, {
  path: "/valid",
  component: valid
}, {
  path: "/input",
  component: input,
  meta: { reqAdmin: true }
}, {
  path: "/list",
  component: list,
  meta: { reqAdmin: true }
}, {
  path: "/company-detail",
  component: cmpDetail
}, {
  path: "/person-detail",
  component: psnDetail
}, {
  path: "/approve",
  component: approve,
  meta: { reqAdmin: true }
}, {
  path: "/login",
  component: login
}, {
  path: "/admin",
  component: admin,
  meta: { reqAdmin: true }
}]
