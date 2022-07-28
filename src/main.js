import Vue from 'vue'
import {
  ToastPlugin, ModalPlugin, BootstrapVue, BootstrapVueIcons,
} from 'bootstrap-vue'

import VueCompositionAPI from '@vue/composition-api'

import router from './router'
import store from './store'
import App from './App.vue'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import { MonthPicker } from 'vue-month-picker'
import { MonthPickerInput } from 'vue-month-picker'

Vue.use(MonthPicker)
Vue.use(MonthPickerInput)


Vue.component('vue-phone-number-input', VuePhoneNumberInput);
// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'
import '@/libs/vue-select'
import '@/libs/vuesax'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
