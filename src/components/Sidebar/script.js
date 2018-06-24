export default {
  name: 'Sidebar',
  methods: {
    resetSnippetView() {
      this.$store.commit('setActiveSnippet', {
        title: '',
        content: '',
        language: '',
        languageFormatted: 'Plain Text',
        id: Math.random().toString(36).replace(/[^a-z]+/g, '')
      });
    }
  }
};