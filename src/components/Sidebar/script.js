export default {
  name: 'Sidebar',

  data() {
    return {
      activeEl: 1
    }
  },

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    },
    language() {
      return this.$store.state.languageFilter;
    }
  },

  methods: {
    setLanguage(el) {
      const languageList = $('.item', $('.language-list'));

      languageList.each(function() {
        $(this).removeClass('active');
      });

      this.activeEl = el;

      const test = $('.item .active', $('.language-list'));

      console.log(test);
      // this.$store.commit('setLanguageFilter', language);
    }
  }
};