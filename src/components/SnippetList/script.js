export default {
  name: 'SnippetList',

  data() {
    return {
      activeElm: null
    }
  },

  mounted() {
    $('#sort').dropdown({
      onChange: (value, text, item) => {
        this.$store.commit('sort', value);
      }
    });
  },

  computed: {
    snippets() {
      const sort = this.$store.state.sort;
      // Store reference so we do not modify the original snippets
      const snippets = this.$store.state.snippets.map(s => s);
      const language = this.$store.state.languageFilter;
      const alphabetical = (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      const newest = (a, b) => new Date(b.createdOn) - new Date(a.createdOn);

      if (sort === 'title') {
        return snippets.sort(alphabetical);
      } else if (sort === 'newest') {
        return snippets.sort(newest);
      } else if (sort === 'oldest') {
        return snippets.sort(newest).reverse();
      }

      if (language === 'All') return snippets;

      return snippets.filter(snippet => {
        return snippet.language.toLowerCase() === language.toLowerCase();
      });
    },
    
    language() {
      return this.$store.state.languageFilter;
    }
  }
};