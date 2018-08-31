// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import storeConfig from './store/store'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.config.devtools = true

const store = new Vuex.Store(storeConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  components: { App },
  template: '<App/>'
})
