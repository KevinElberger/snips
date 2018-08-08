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
      const newest = (a, b) => new Date(b.createdOn) - new Date(a.createdOn);
      const lastUpdated = (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated);
      const alphabetical = (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase());

      if (sort === 'title') {
        snippets.sort(alphabetical);
      } else if (sort === 'newest') {
        snippets.sort(newest);
      } else if (sort === 'oldest') {
        snippets.sort(newest).reverse();
      } else if (sort === 'last updated') {
        snippets.sort(lastUpdated);
      }

      return snippets;
    },
    
    search(snippets, search) {
      return snippets.filter(snippet => {
        return snippet.title.toLowerCase().includes(search.toLowerCase());
      });
    },

    filterByLabel(snippets, filter) {
      return snippets.filter(snippet => {
        return snippet.labels.filter(label => {
          return label.name.trim() === filter.trim();
        }).length > 0;
      });
    }
  },

  computed: {
    snippets() {
      const sort = this.$store.state.sort;
      const search = this.$store.state.search;
      const labelFilter = this.$store.state.labelFilter;
      // Store reference so we do not modify the original snippets
      let snippets = this.$store.state.snippets.map(s => s);
      const language = this.$store.state.languageFilter;

      this.sort(snippets, sort);
      snippets = this.search(snippets, search);

      if (labelFilter) {
        snippets = this.filterByLabel(snippets, labelFilter);
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