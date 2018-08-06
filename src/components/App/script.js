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
  getLanguageByFile,
  authenticateGithub
} from '../../utils/utils.js';
import { getGists, patchGist } from '../../utils/githubApi.js';
import isElectron from 'is-electron';

import { 
  notifyPin,
  notifySave,
  notifyDelete,
  setEditorMode,
  setActiveLabels,
  getAppliedLabels,
  deleteAppliedLabel
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

  data() {
    return {
      content: '',
      text: 'text',
      languageFilter: '',
      title: 'Untitled Snippet',
      activeSnippet: getDefaultSnippet()
    }
  },

  beforeCreate() {
    if (! isElectron()) return;

    ipcRenderer.on('load-data', (event, data) => {
      this.$store.commit('load', data);

      if (this.$store.state.snippets.length) {
        this.displaySnippet(this.$store.state.snippets[0]);
      }

      if (data.auth.token) {
        getGists(data.auth.token).then(gists => {
          this.$store.commit('addGists', gists);
        });
      }
    });
  },

  mounted() {
    this.editor = ace.edit('content');
  },

  methods: {
    login() {
      authenticateGithub();
    },

    logout() {
      $('.mini.modal').modal('show');

      $('.ui.positive').on('click', () => {
        logoutUser();

        if (this.activeSnippet.isGist) {
          this.resetActiveSnippet();
        }

        if (isElectron()) {
          ipcRenderer.send('save-auth', defaultAuth);
        }
      });
    },

    /**
     * Removes a snippet from the list and
     * deletes a Gist from GitHub
     */
    del() {
      const { id } = this.activeSnippet;
      const isGist = this.activeSnippet.isGist;
      const token = this.$store.state.auth.token;
      const hasBeenSaved = this.$store.getters.getSnippet(id);
      const files = isGist ? this.$store.getters.getFiles(this.activeSnippet.gistID) : null;

      if (! hasBeenSaved) return;
      
      if (isGist && files.length) {
        files.find(file => {
          if (file.id === id) file.toDelete = true;
        });
      }
      
      if (isGist) {
        patchGist(this.activeSnippet.gistID, token, files);
      }

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
      const isGist = this.activeSnippet.isGist;      
      const token = this.$store.state.auth.token;      
      const hasBeenSaved = this.$store.getters.getSnippet(id);

      this.updateValues();

      if (isGist) {
        patchGist(this.activeSnippet.gistID, token, [
          this.activeSnippet
        ]);
      }

      if (hasBeenSaved) {
        this.$store.commit('updateSnippet', this.activeSnippet);
      } else {
        this.$store.commit('addSnippet', this.activeSnippet);
      }

      notifySave.bind(this, this.activeSnippet.title)();

      // Avoid saving GitHub Gists so we can re-sync on new session
      if (isElectron()) {
        ipcRenderer.send('save-snippets', this.$store.state.snippets.filter(snip => {
          return !snip.isGist;
        }));
      }
    },

    /**
     * Sets the newest content values for the active snippet
     */
    updateValues() {
      const content = this.editor.getValue();
      const isGist = this.activeSnippet.isGist;
      let currentTitle = this.activeSnippet.title;
      const hasTitle = currentTitle !== '';

      if (! hasTitle) {
        currentTitle = this.title;
      }

      this.activeSnippet.language = getLanguageByFile(currentTitle);

      if (isGist) {
        this.activeSnippet.filename = currentTitle;
      }

      let labels = [].concat.apply([], getAppliedLabels().map(label => {
        return this.$store.getters.getLabel(label);
      }));

      Object.assign(this.activeSnippet, {
        labels,
        content,
        lastUpdated: new Date()
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
      this.editor.focus();
      this.editor.navigateFileEnd();

      setEditorMode(this.activeSnippet.title);
      setActiveLabels(this.activeSnippet.labels);

      this.$store.commit('updateSnippet', this.activeSnippet);
    },

    /**
     * Resets all of the active snippet's values to default values
     */
    resetActiveSnippet() {
      this.editor.setValue('');
      $('input.title').val('');

      deleteAppliedLabel(null, true);      
 
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