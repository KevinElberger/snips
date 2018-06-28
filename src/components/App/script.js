import Snippet from '../Snippet/Snippet.vue';
import Sidebar from '../Sidebar/Sidebar.vue';
import Menubar from '../Menubar/Menubar.vue';
import SnippetList from '../SnippetList/SnippetList.vue';

import { getId } from '../../utils.js';

export default {
  name: 'App',

  components: {
    Sidebar,
    Menubar,
    Snippet,
    SnippetList
  },

  editor: null,
  language: null,

  data() {
    return {
      text: 'text',
      languageFilter: '',
      plainText: 'Plain Text',
      title: 'Untitled Snippet',
      activeSnippet: {
        title: '',
        content: '',
        id: getId(),
        language: '',
        isActive: true,
        isPinned: false,
        languageFormatted: ''
      }
    }
  },

  mounted() {
    this.editor = ace.edit('content');
    this.language = $('.ui.dropdown');
  },

  methods: {

    /**
     * Removes a snippet from the list
     */
    del() {
      const { id } = this.activeSnippet;
      const isInList = this.$store.getters.getSnippet(id);

      if (! isInList) return;

      this.$store.commit('deleteSnippet', this.activeSnippet);
      this.resetActiveSnippet();
    },

    /**
     * Toggles the pin status of the active snippet
     */
    togglePin() {
      this.activeSnippet.isPinned = ! this.activeSnippet.isPinned;
    },

    /**
     * Saves the active snippet
     */
    save() {
      const { id } = this.activeSnippet;
      const isInList = this.$store.getters.getSnippet(id);

      this.updateValues();

      if (isInList) {
        this.$store.commit('updateSnippet', this.activeSnippet);
      } else {
        this.$store.commit('addSnippet', this.activeSnippet);
      }
    },

    /**
     * Sets the newest content values for the active snippet
     */
    updateValues() {
      const content = this.editor.getValue();
      const newLanguage = this.language.dropdown('get value') || this.text;
      const newFullLanguage = this.language.dropdown('get text') || this.plainText;

      if (this.activeSnippet.title === '') {
        this.activeSnippet.title = this.title;
      }

      Object.assign(this.activeSnippet, {
        content,
        language: newLanguage,
        languageFormatted: newFullLanguage
      });
    },

    /**
     * Displays a new snippet after resetting 
     * the current active snippet
     * 
     * @param {Object} snippet the snippet to display
     */
    displaySnippet(snippet) {
      this.resetActiveSnippet();

      Object.assign(this.activeSnippet, snippet);

      this.activeSnippet.isActive = true;
      this.editor.setValue(snippet.content);
      this.language.dropdown('set value', this.activeSnippet.language);
      this.language.dropdown('set text', this.activeSnippet.languageFormatted);

      this.$store.commit('updateSnippet', this.activeSnippet);
    },

    /**
     * Resets all of the active snippet's values to default values
     */
    resetActiveSnippet() {
      this.editor.setValue('');
      this.language.dropdown('set value', this.text);
      this.language.dropdown('set text', this.plainText);

      this.$store.state.snippets.forEach(snippet => {
        snippet.isActive = false;
        this.$store.commit('updateSnippet', snippet);
      });

      this.activeSnippet = {
        title: '',
        content: '',
        id: getId(),
        language: '',
        isActive: true,
        isPinned: false,
        languageFormatted: ''
      };
    },

    setLanguageFilter(target) {
      this.language = target.innerText.replace('#', '');
    }
  }
};