import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    snippets: [],
    activeSnippet: null
  },
  mutations: {
    addSnippet (state, payload) {
      this.snippets.push(payload);
    }
  }
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});