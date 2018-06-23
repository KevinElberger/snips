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
        id: this._uid,
        content: editor.getValue(),
        title: this.title || 'No Title',
        language: this.language || 'text'
      };

      if (snippet.content === '') return;

      this.$store.commit('addSnippet', snippet);
    }
  }
};