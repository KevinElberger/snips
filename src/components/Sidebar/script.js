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
      
      this.$store.state.snippets.map(s => {
        const lang = s.language.toLowerCase();
        languages[lang] = languages[lang] ? languages[lang] + 1 : 1;
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