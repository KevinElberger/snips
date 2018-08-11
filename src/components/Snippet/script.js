import { starGist, unstarGist } from '../../utils/githubApi.js';
import { notify, setEditorMode } from '../../utils/utils.js';

export default {
  name: 'Snippet',
  props: ['activeSnippet'],

  mounted: function() {
    const editor = ace.edit('content');
    const modelist = ace.require('ace/ext/modelist');
    const title = $('#title-wrapper input');
    
    editor.focus();

    // Dynamically set syntax highlighting based on file name
    title.on('input', function() {
      setEditorMode($(this).val());
    });

    editor.setTheme('ace/theme/tomorrow_night');

    $('.multiple.dropdown').dropdown();
  },
  
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    starred() {
      const snippet = this.$store.state.snippets.find(snippet => {
        return snippet.id === this.activeSnippet.id;
      });

      return snippet ? snippet.starred : false;
    }
  },

  methods: {
    toggleGistStar() {
      const id = this.activeSnippet.gistID;
      const token = this.$store.state.auth.token;
      const starred = this.activeSnippet.starred;
      const allGistFiles = this.$store.state.snippets.filter(snippet => {
        return snippet.gistID === id;
      });

      allGistFiles.forEach(file => {
        file.starred = ! starred;
        this.$store.commit('updateSnippet', file);
      });

      if (! starred) {
        starGist(id, token).then(response => {
          this.$store.commit('updateSnippet', this.activeSnippet);
        }).catch(err => console.log(err));
      } else {
        unstarGist(id, token).then(response => {
          this.$store.commit('updateSnippet', this.activeSnippet);
        }).catch(err => console.log(err));
      }

      notify.bind(this, {
        group: 'alerts',
        title: starred ? 'Unstarred' : 'Starred',
        text: `${this.activeSnippet.title} was ${starred ? 'unstarred' : 'starred'}!`
      })();
    }
  }
};