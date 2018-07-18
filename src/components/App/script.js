import Snippet from '../Snippet/Snippet.vue';
import Sidebar from '../Sidebar/Sidebar.vue';
import Menubar from '../Menubar/Menubar.vue';
import SnippetList from '../SnippetList/SnippetList.vue';
import {
  defaultAuth,
  getDefaultSnippet
 } from '../../utils/defaults.js';
import {
  logoutUser,
  authenticateGithub
} from '../../utils/utils.js';
import isElectron from 'is-electron';

import { 
  notifyPin,
  notifySave,
  notifyDelete
} from '../../utils/utils.js';

const ipcRenderer = window.ipcRenderer;

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
      content: '',
      text: 'text',
      languageFilter: '',
      plainText: 'Plain Text',
      title: 'Untitled Snippet',
      activeSnippet: getDefaultSnippet()
    }
  },

  beforeCreate() {
    if (isElectron()) {
      ipcRenderer.on('load-data', (event, data) => {
        this.$store.commit('load', data);
      });
    }
  },

  mounted() {
    this.editor = ace.edit('content');
    this.language = $('.ui.dropdown');
  },

  methods: {
    login() {
      authenticateGithub();
    },

    logout() {
      logoutUser();
      
      if (isElectron()) {
        ipcRenderer.send('save-auth', defaultAuth);
      }
    },

    /**
     * Removes a snippet from the list
     */
    del() {
      const { id } = this.activeSnippet;
      const isInList = this.$store.getters.getSnippet(id);

      if (! isInList) return;

      this.$store.commit('deleteSnippet', this.activeSnippet);
      notifyDelete.bind(this, this.activeSnippet.title)();
      this.resetActiveSnippet();

      if (isElectron()) {
        ipcRenderer.send('save-snippets', this.$store.state.snippets);              
      }
    },

    /**
     * Toggles the pin status of the active snippet
     */
    togglePin() {
      this.activeSnippet.isPinned = ! this.activeSnippet.isPinned;

      notifyPin.bind(this, this.activeSnippet.title, this.activeSnippet.isPinned)();
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

      notifySave.bind(this, this.activeSnippet.title)();
      if (isElectron()) {
        ipcRenderer.send('save-snippets', this.$store.state.snippets);
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

      return this.activeSnippet;
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
      $('input.title').val(this.activeSnippet.title);
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
      $('input.title').val('');
      this.language.dropdown('set value', this.text);
      this.language.dropdown('set text', this.plainText);

      this.$store.state.snippets.forEach(snippet => {
        snippet.isActive = false;
        this.$store.commit('updateSnippet', snippet);
      });

      this.activeSnippet = getDefaultSnippet();
    },

    setLanguageFilter(target) {
      this.language = target.innerText.replace('#', '');
    }
  }
};