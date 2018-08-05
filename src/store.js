import Vue from 'vue';
import Vuex from 'Vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    auth: {
      avatar: '',
      token: null,
      loggedIn: false
    },
    search: '',
    sort: 'title',
    labels: [],
    snippets: [],
    loggedIn: false,
    languageFilter: 'All'
  },

  getters: {
    getSnippet: (state) => (id) => {
      return state.snippets.find(snippet => snippet.id === id);
    },
    getFiles: (state) => (id) => {
      return state.snippets.filter(snippet => snippet.gistID === id);
    },
    getLabel: (state) => (name) => {
      return state.labels.filter(label => label.name === name);
    }
  },

  mutations: {
    load(state, payload) {
      state.auth.token = payload.auth.token;
      state.auth.loggedIn = !!payload.auth.token;
      state.snippets = payload.snippets;
    },

    login(state, payload) {
      state.auth.loggedIn = true;
      state.auth.token = payload.token;
      state.auth.avatar = payload.avatar;
    },

    logout(state, payload) {
      state.auth = payload;

      let i = state.snippets.length;

      while (i--) {
        if (state.snippets[i].isGist) {
          state.snippets.splice(i, 1);
        }
      }
    },

    sort(state, payload) {
      state.sort = payload;
    },

    search(state, payload) {
      state.search = payload;
    },
  
    addSnippet(state, payload) {
      state.snippets.push(payload);
    },

    addLabel(state, payload) {
      state.labels.push(payload);
    },

    addGists(state, payload) {
      state.snippets.push(...payload);
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