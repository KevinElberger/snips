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