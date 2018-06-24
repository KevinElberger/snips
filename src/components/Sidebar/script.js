export default {
  name: 'Sidebar',
  computed: {
    snippets() {
      return this.$store.state.snippets;
    }
  },
  
  methods: {
    resetSnippetView() {
      this.$store.commit('setActiveSnippet', {
        title: '',
        content: '',
        language: 'text',
        languageFormatted: 'Plain Text',
        id: Math.random().toString(36).replace(/[^a-z]+/g, '')
      });
    }
  }
};