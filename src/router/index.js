import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import come from '../views/come.vue'
import leave from '../views/leave.vue'
import valid from '../views/valid.vue'
import input from '../views/input.vue'
import list from '../views/list.vue'
import cmpDetail from '../views/cmpDetail.vue'
import psnDetail from '../views/psnDetail.vue'
import login from '../views/login.vue'
import admin from '../views/admin.vue'
import approve from '../views/approve.vue'
import { reqBackend } from '../utils.js'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/population-statistics-frt',
    redirect: '/population-statistics-frt/home',
  },
  {
    path: '/population-statistics-frt/home',
    component: home,
  },
  {
    path: '/population-statistics-frt/come',
    component: come,
  },
  {
    path: '/population-statistics-frt/leave',
    component: leave,
  },
  {
    path: '/population-statistics-frt/valid',
    component: valid,
  },
  {
    path: '/population-statistics-frt/input',
    component: input,
    meta: { reqAdmin: true },
  },
  {
    path: '/population-statistics-frt/list',
    component: list,
    meta: { reqAdmin: true },
  },
  {
    path: '/population-statistics-frt/company-detail',
    component: cmpDetail,
  },
  {
    path: '/population-statistics-frt/person-detail',
    component: psnDetail,
  },
  {
    path: '/population-statistics-frt/approve',
    component: approve,
    meta: { reqAdmin: true },
  },
  {
    path: '/population-statistics-frt/login',
    component: login,
  },
  {
    path: '/population-statistics-frt/admin',
    component: admin,
    meta: { reqAdmin: true },
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

async function validLogin(role) {
  return reqBackend(
    axios.post(`/population-statistics/api/v1/${role}/verify`)
  )
}

router.beforeEach(async (to, _from, next) => {
  if (to.matched.some((record) => record.meta.reqAdmin)) {
    try {
      await validLogin('admin')
      next()
    } catch (e) {
      next({
        path: '/population-statistics-frt/login',
        query: {
          redirect: to.fullPath,
          mode: 'admin',
        },
      })
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
