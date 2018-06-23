export default {
  name: 'SnippetList',
  computed: {
    snippets() {
      return this.$store.state.snippets;
    }
  }
};