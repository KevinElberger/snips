export default {
  name: 'Sidebar',

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    }
  }
};