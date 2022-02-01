import Vue from 'vue'
import Vuex from 'vuex'
import { reqBackend } from './utils.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: null
  },
  mutations: {
    SET_LOGIN (state, payload) {
      state.login = Object.assign(payload.login, {
        token: payload.token
      })
    }
  },
  actions: {
    async login (ctx, param) {
      ctx.commit('SET_LOGIN', await reqBackend(axios.post(
        `/population-statistics/api/v1/${param.role}/log/in`, param.form
      )))
    }
  },
  getters: {
    lgnToken: state => state.login ? state.login.token : ''
  }
})
