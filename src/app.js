import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App/App.vue';
import Notifications from 'vue-notification';

Vue.use(Vuex);
Vue.use(Notifications);

const store = new Vuex.Store({
  state: {
    snippets: [],
    loggedIn: false,
    languageFilter: 'All'
  },

  getters: {
    getSnippet: (state) => (id) => {
      return state.snippets.find(snippet => snippet.id === id);
    }
  },

  mutations: {
    loadSnippets(state, payload) {
      state.snippets = payload;
    },

    addSnippet(state, payload) {
      state.snippets.push(payload);
    },

    deleteSnippet(state, payload) {
      const idx = state.snippets.findIndex(snip => {
        return snip.id === payload.id;
      });
      
      state.snippets.splice(idx, 1);
    },

    updateSnippet(state, payload) {
      const idx = state.snippets.findIndex(snip => {
        return snip.id === payload.id;
      });

      Vue.set(state.snippets, idx, payload);
    }, 

    setLanguageFilter(state, payload) {
      state.languageFilter = payload;
    }
  }
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});