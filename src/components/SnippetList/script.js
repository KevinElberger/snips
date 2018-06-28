export default {
  name: 'SnippetList',

  data() {
    return {
      activeElm: null
    }
  },

  computed: {
    snippets() {
      const snippets = this.$store.state.snippets;
      const language = this.$store.state.languageFilter;

      if (language === 'All') return snippets;

      return snippets.filter(snippet => {
        return snippet.languageFormatted === language;
      });
    },
    
    language() {
      return this.$store.state.languageFilter;
    }
  }
};