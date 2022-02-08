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
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: home,
  },
  {
    path: '/come',
    component: come,
  },
  {
    path: '/leave',
    component: leave,
  },
  {
    path: '/valid',
    component: valid,
  },
  {
    path: '/input',
    component: input,
    meta: { reqAdmin: true },
  },
  {
    path: '/list',
    component: list,
    meta: { reqAdmin: true },
  },
  {
    path: '/company-detail',
    component: cmpDetail,
  },
  {
    path: '/person-detail',
    component: psnDetail,
  },
  {
    path: '/approve',
    component: approve,
    meta: { reqAdmin: true },
  },
  {
    path: '/login',
    component: login,
  },
  {
    path: '/admin',
    component: admin,
    meta: { reqAdmin: true },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/population-statistics/',
  routes,
})

async function validLogin(role) {
  return reqBackend(
    axios.get(`/population-statistics/api/v1/${role}/log/stat`, {
      headers: { token: store.getters.lgnToken },
    })
  )
}

router.beforeEach(async (to, _from, next) => {
  if (to.matched.some((record) => record.meta.reqAdmin)) {
    try {
      await validLogin('admin')
      next()
    } catch (e) {
      next({
        path: '/login',
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
