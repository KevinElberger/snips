export default {
  name: 'SnippetList',

  data() {
    return {
      activeElm: null
    }
  },

  computed: {
    snippets() {
      return this.$store.state.snippets;
    },
    
    language() {
      return this.$store.state.languageFilter;
    }
  }
};