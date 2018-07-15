import Vue from 'vue';
import Vuex from 'Vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    auth: {
      token: null,
    },
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
    login(state, payload) {

    },

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