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
  methods: {
    sort(snippets, sort) {
      const alphabetical = (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      const newest = (a, b) => new Date(b.createdOn) - new Date(a.createdOn);

      if (sort === 'title') {
        snippets.sort(alphabetical);
      } else if (sort === 'newest') {
        snippets.sort(newest);
      } else if (sort === 'oldest') {
        snippets.sort(newest).reverse();
      }

      return snippets;
    },
    
    search(snippets, search) {
      return snippets.filter(snippet => {
        return snippet.title.toLowerCase().includes(search.toLowerCase());
      });
    }
  },

  computed: {
    snippets() {
      const sort = this.$store.state.sort;
      const search = this.$store.state.search;
      // Store reference so we do not modify the original snippets
      let snippets = this.$store.state.snippets.map(s => s);
      const language = this.$store.state.languageFilter;

      this.sort(snippets, sort);
      snippets = this.search(snippets, search);

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