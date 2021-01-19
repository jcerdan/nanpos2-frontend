// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias
import Vue from 'vue'
// import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Vue2Filters from 'vue2-filters'
import VueResource from 'vue-resource'
import store from './store'

Vue.use(Buefy, {
  defaultFirstDayOfWeek: 1,
  defaultMonthNames: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
  defaultDayNames: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte']
})
Vue.use(Vue2Filters)
Vue.use(VueResource)
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.config.silent = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
