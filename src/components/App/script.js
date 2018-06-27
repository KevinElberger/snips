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

  data() {
    return {
      text: 'text',
      plainText: 'Plain Text',
      title: 'Untitled Snippet',
      activeSnippet: {
        title: '',
        content: '',
        id: getId(),
        language: '',
        isPinned: false,
        languageFormatted: ''
      }
    }
  },

  methods: {
    del() {
      const { id } = this.activeSnippet;
      const editor = ace.edit('content');
      const isInList = this.$store.getters.getSnippet(id);

      if (! isInList) return;

      this.$store.commit('deleteSnippet', this.activeSnippet);
      this.resetActiveSnippet();
    },

    pin() {
      this.activeSnippet.isPinned = ! this.activeSnippet.isPinned;
    },

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

    updateValues() {
      const language = $('.ui.dropdown');
      const content = ace.edit('content').getValue();
      const newLanguage = language.dropdown('get value') || this.text;
      const newFullLanguage = language.dropdown('get text') || this.plainText;

      if (this.activeSnippet.title === '') {
        this.activeSnippet.title = this.title;
      }

      Object.assign(this.activeSnippet, {
        content,
        language: newLanguage,
        languageFormatted: newFullLanguage
      });
    },

    resetActiveSnippet() {
      ace.edit('content').setValue('');

      this.activeSnippet = {
        title: '',
        content: '',
        id: getId(),
        language: '',
        isPinned: false,
        languageFormatted: ''
      };
    }
  }
};