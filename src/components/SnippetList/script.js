export default {
  name: 'SnippetList',
  computed: {
    snippets() {
      return this.$store.state.snippets;
    }
  },

  methods: {
    viewSnippet(snippet) {
      this.$store.commit('setActiveSnippet', snippet);
    }
  }
};