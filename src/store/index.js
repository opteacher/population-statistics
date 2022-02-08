import Vue from 'vue'
import Vuex from 'vuex'
import { reqBackend } from '../utils.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: null,
  },
  mutations: {
    SET_LOGIN(state, payload) {
      state.login = Object.assign(payload.login, {
        token: payload.token,
      })
    },
  },
  actions: {
    async login(ctx, param) {
      const result = await reqBackend(
        axios.post(
          `/population-statistics/api/v1/${param.role}/log/in`,
          param.form
        )
      )
      if (typeof result === 'string') {
        return Promise.reject(new Error(result.error))
      }
      ctx.commit('SET_LOGIN', result)
    },
  },
  getters: {
    lgnToken: (state) => (state.login ? state.login.token : ''),
  },
})
