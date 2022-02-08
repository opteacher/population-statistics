import Vue from 'vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './styles.less'

axios.defaults.baseURL = 'http://opteacher.top'

Vue.config.productionTip = false

new Vue({
  template: '<router-view />',
  router,
  store
}).$mount('#app')
