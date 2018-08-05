import {
  validateHex,
  getRandomColor
} from '../../utils/utils.js';

export default {
  name: 'Sidebar',

  data() {
    return {
      activeEl: 'All',
      labelMenuOpen: false,
      color: getRandomColor()
    }
  },

  mounted() {
    const labelBtn = $('#add-label .menu');

    // Set randomize button with current color value
    $('.random-button').css({ background: this.color });

    $('#add-label .plus').on('click', () => labelBtn.toggle());

    // Prevent label menu from closing
    $('.labels-wrapper').on('click', (e) => e.stopPropagation());

    $('#app').on('click', () => {
      if (labelBtn.is(':visible')) {
        labelBtn.toggle();
      }
    });
  },

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    },
    snippetCount() {
      return this.$store.state.snippets.length;
    },
    languages() {
      const languages = {};
      const snippets = this.$store.state.snippets;

      // Alphabetize all stored snippet languages
      const sortedLanguages = snippets.sort((a, b) => {
        return a.language > b.language;
      });

      // Store the count value of each language
      Object.keys(sortedLanguages).forEach(s => {
        const lang = sortedLanguages[s].language.toLowerCase();

        if (lang !== '') {
          languages[lang] = languages[lang] ? languages[lang] + 1 : 1;
        }
      });

      return languages;
    },
    isLoggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    getAvatar() {
      return this.$store.state.auth.avatar;
    }
  },

  methods: {
    setColor() {
      const labelColorInput = $('.color');
      const randomColorBtn = $('.random-button');

      this.color = getRandomColor();
      labelColorInput.val(this.color);
      randomColorBtn.css({ background: this.color });
    },

    setLanguage(language) {
      this.activeEl = language;

      this.$store.commit('setLanguageFilter', language);
    }
  }
};