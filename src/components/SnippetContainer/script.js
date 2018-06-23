export default {
  name: 'SnippetContainer',
  data() {
    return {
      title: '',
      content: '',
      language: ''
    }
  },

  mounted: function() {
    const editor = ace.edit('editor');
    const modelist = ace.require("ace/ext/modelist");

    $('.ui.dropdown').dropdown({
      onChange: (value, text, item) => {
        const mode = modelist.modesByName[value].mode;

        this.language = value;

        editor.session.setMode(mode);
      }
    });

    editor.setTheme("ace/theme/tomorrow_night");
  },

  methods: {
    save() {
      const editor = ace.edit('editor');

      const snippet = {
        content: editor.getValue(),
        title: this.title || 'No Title',
        language: this.language || 'text',
        id: Math.random().toString(36).replace(/[^a-z]+/g, '')
      };

      if (snippet.content === '') return;

      this.$store.commit('addSnippet', snippet);

      editor.setOptions({ readOnly: true });
    },
    edit() {
      const editor = ace.edit('editor');

      editor.setOptions({ readOnly: false });
    }
  }
};