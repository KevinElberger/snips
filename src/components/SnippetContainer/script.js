export default {
  name: 'SnippetContainer',
  data() {
    const active = this.$store.state.activeSnippet;

    return {
      title: active ? active.title : '',
      content: active ? active.content : '',
      language: active ? active.language : ''
    }
  },

  mounted: function() {
    const editor = ace.edit('editor');
    const modelist = ace.require("ace/ext/modelist");

    editor.focus();

    $('.ui.dropdown').dropdown({
      onChange: (value, text, item) => {
        const mode = modelist.modesByName[value].mode;

        this.language = value;

        editor.session.setMode(mode);
      }
    });

    editor.setTheme("ace/theme/tomorrow_night");
  },

  computed: {
    activeSnippet() {
      return this.$store.state.activeSnippet;
    }
  },

  methods: {
    save() {
      const editor = ace.edit('editor');
      const active = this.$store.state.activeSnippet;
      const snippet = {
        content: editor.getValue(),
        title: this.title || 'No Title',
        language: this.language || 'text'
      };
      const id = Math.random().toString(36).replace(/[^a-z]+/g, '');

      if (snippet.content === '' && ! active) {
        return;
      }

      if (active) {
        Object.assign(active, snippet);
        this.$store.commit('updateSnippet', active);
        return;
      }

      snippet.id = id;

      this.$store.commit('addSnippet', snippet);
    }
  }
};