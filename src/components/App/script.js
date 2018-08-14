import icon from '../../../static/icons/png/48x48.png';
import Snippet from '../Snippet/Snippet.vue';
import Sidebar from '../Sidebar/Sidebar.vue';
import Menubar from '../Menubar/Menubar.vue';
import SnippetList from '../SnippetList/SnippetList.vue';
import constants from '../../utils/constants.js';
import {
  defaultAuth,
  getDefaultSnippet
 } from '../../utils/defaults.js';
import {
  logoutUser,
  getLanguageByFile,
  authenticateGithub,
  resetPrivacyDropdown
} from '../../utils/utils.js';
import { getGists, patchGist } from '../../utils/githubApi.js';
import isElectron from 'is-electron';

import {
  notify,
  setEditorMode,
  setActiveLabels,
  getAppliedLabels,
  deleteAppliedLabel
} from '../../utils/utils.js';

const shell = require('electron').shell;
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
      icon: icon,
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

      $('#progress-bar').progress('increment');

      this.$store.state.snippets.forEach(s => s.isActive = false);

      if (data.auth.token) {
        getGists(data.auth.token).then(gists => {
          this.$store.commit('addGists', gists);
          $('#progress-bar').progress('increment');          
        });
      } else {
        $('#progress-bar').progress('increment');
      }
    });
  },

  mounted() {
    this.editor = ace.edit('content');

    $('#loader .dimmer').dimmer('show');

    $('#progress-bar').progress({
      total: constants.PROGRESS_COUNT
    });

    // Display the app when loading is finished 
    window.setInterval(() => {
      if ($('#progress-bar').progress('is complete')) {
        clearInterval(this);
        $('#loader').hide();
        $('#loader .dimmer').dimmer('hide');
      }
    }, 1000);

    $(document).on('click', 'a[href^="http"]', function(event) {
      event.preventDefault();
      shell.openExternal(this.href);
    });
  },

  methods: {
    login() {
      authenticateGithub();
    },

    logout() {
      let snippets = this.$store.state.snippets;

      $('#logout').modal('show');

      $('.ui.positive').on('click', () => {
        logoutUser();

        if (this.activeSnippet.isGist) {
          this.resetActiveSnippet();
        }

        // Remove any GitHub Gists since user is logging out
        snippets = snippets.filter(snippet => {
          return !snippet.isGist;
        });

        if (isElectron()) {
          ipcRenderer.send('save-auth', defaultAuth);
          ipcRenderer.send('save-snippets', snippets);
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
      notify.bind(this, {
        group: 'alerts',
        title: this.activeSnippet.title,
        text: `${this.activeSnippet.title} was deleted!`
      })();
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

      notify.bind(this, {
        group: 'alerts',
        title: this.activeSnippet.title,
        text: `${this.activeSnippet.title} was ${this.activeSnippet.isPinned}!`
      })();
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

      notify.bind(this, {
        group: 'alerts',
        title: this.activeSnippet.title,
        text: `${this.activeSnippet.title} was saved!`
      })();

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
      const isPublic = $('#gist-privacy').dropdown('get value') === 'Public';

      this.activeSnippet.language = getLanguageByFile(currentTitle);
      
      if (isGist) {
        this.activeSnippet.public = isPublic;
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

      $('.ui.sidebar').sidebar('hide');
      
      Object.assign(this.activeSnippet, snippet);

      this.activeSnippet.isActive = true;
      $('input.title').val(this.activeSnippet.title);

      this.editor.setValue(snippet.content);
      this.editor.focus();
      this.editor.navigateFileEnd();

      setEditorMode(this.activeSnippet.title);

      this.$store.commit('updateSnippet', this.activeSnippet);

      setActiveLabels(this.activeSnippet.labels);
      
      if (snippet.isGist) {
        $('#gist-privacy').dropdown('set selected', snippet.public ? 'Public' : 'Private');
      }
    },

    /**
     * Resets all of the active snippet's values to default values
     */
    resetActiveSnippet() {
      this.editor.setValue('');
      $('input.title').val('');

      deleteAppliedLabel(null, true);
      resetPrivacyDropdown();

      this.$store.state.snippets.forEach(snippet => {
        snippet.isActive = false;
        this.$store.commit('updateSnippet', snippet);
      });

      this.activeSnippet = getDefaultSnippet();
    },

    setLanguageFilter(target) {
      this.language = target.innerText.replace('#', '');
    },

    hideAbout() {
      $('#about').modal('hide');
    }
  }
};