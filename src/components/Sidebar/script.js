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
      const languages = {};
      const snippets = this.$store.state.snippets;
      const sortedLanguages = snippets.sort((a, b) => {
        return a.language > b.language;
      });

      Object.keys(sortedLanguages).forEach(s => {
        const lang = sortedLanguages[s].language.toLowerCase();

        if (lang !== '') {
          languages[lang] = languages[lang] ? languages[lang] + 1 : 1;
        }
      });

      return languages;
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
      this.activeEl = language;

      this.$store.commit('setLanguageFilter', language);
    }
  }
};