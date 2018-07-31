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
    languages() {
      const languages = this.$store.state.snippets.map(s => s.language);
      return Array.from(new Set(languages));
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