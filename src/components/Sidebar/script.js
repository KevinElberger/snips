export default {
  name: 'Sidebar',

  data() {
    return {
      activeEl: 'All'
    }
  },

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    },
    language() {
      return this.$store.state.languageFilter;
    },
    isLoggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    getAvatar() {
      return this.$store.state.auth.avatar;
    }
  },

  methods: {
    setLanguage(language) {
      const languageList = $('.item .active', $('.language-list'));

      this.activeEl = language;

      this.$store.commit('setLanguageFilter', language);
    }
  }
};