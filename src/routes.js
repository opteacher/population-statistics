import home from "./pages/home.vue"
import come from "./pages/come.vue"
import leave from "./pages/leave.vue"
import valid from "./pages/valid.vue"
import input from "./pages/input.vue"
import list from "./pages/list.vue"
import cmpDetail from "./pages/cmpDetail.vue"
import psnDetail from "./pages/psnDetail.vue"
import login from "./pages/login.vue"
import admin from "./pages/admin.vue"
import approve from "./pages/approve.vue"

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
