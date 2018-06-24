import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    snippets: [],
    activeSnippet: null
  },

  getters: {
    getSnippetById: (state) => (id) => {
      return state.snippets.find(snippet => snippet.id === id);
    },
    getActiveSnippet: (state) => {
      return state.activeSnippet;
    }
  },

  mutations: {
    addSnippet (state, payload) {
      state.snippets.push(payload);
      state.activeSnippet = payload;
    },

    deleteSnippet(state, payload) {
      const idx = state.snippets.findIndex(snip => snip.id === payload.id);
      
      state.snippets.splice(idx, 1);
    },

    updateSnippet (state, payload) {
      const idx = state.snippets.findIndex(snip => snip.id === payload.id);

      Vue.set(state.snippets, idx, payload);
    },

    pinSnippet (state, payload) {
      Vue.set(state.activeSnippet, 'isPinned', payload);
    },

    setActiveSnippet (state, payload) {
      state.activeSnippet = payload;
    }
  }
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});