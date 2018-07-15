import Vue from 'vue';
import App from './components/App/App.vue';
import Notifications from 'vue-notification';
import { store } from './store.js';

Vue.use(Notifications);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});