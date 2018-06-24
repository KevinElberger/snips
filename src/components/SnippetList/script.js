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
    }
  },

  methods: {
    toggleSnippet(snippet) {
      this.activeElm = snippet.id;
      this.$store.commit('setActiveSnippet', snippet);
    }
  }
};