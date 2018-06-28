export default {
  name: 'Sidebar',

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    },
    language() {
      return this.$store.state.languageFilter;
    }
  },
  methods: {
    setLanguage(target) {
      const language = $(target).text();
      const languageList = $('.item', $('.language-list'));

      $(target).addClass('active');

      languageList.each(function() {
        if ($(this).text() !== language) $(this).removeClass('active');
      });

      this.$store.commit('setLanguageFilter', language);
    }
  }
};