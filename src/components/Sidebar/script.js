export default {
  name: 'Sidebar',

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    }
  },
  
  methods: {
    resetSnippetView() {
      this.$store.commit('setActiveSnippet', {
        title: '',
        content: '',
        isPinned: false,
        language: 'text',
        languageFormatted: 'Plain Text',
        id: Math.random().toString(36).replace(/[^a-z]+/g, '')
      });
    },

    toggleSnippet(snippet) {
      this.$store.commit('setActiveSnippet', snippet);      
    }
  }
};