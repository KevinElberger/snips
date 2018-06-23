import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    snippets: []
  },
  mutations: {
    addSnippet (state, payload) {
      state.snippets.push(payload);
    }
  }
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});