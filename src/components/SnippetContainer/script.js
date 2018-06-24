import { mapGetters } from 'vuex';

export default {
  name: 'SnippetContainer',
  data() {
    const active = this.$store.state.activeSnippet;

    return {
      title: active ? active.title : '',
      content: active ? active.content : '',
      language: active ? active.language : '',
      languageFormatted: active ? active.languageFormatted : ''
    };
  },

  mounted: function() {
    const editor = ace.edit('editor');
    const modelist = ace.require("ace/ext/modelist");

    editor.focus();

    $('.ui.dropdown').dropdown({
      onChange: (value, text, item) => {
        if (! value) return;

        const mode = modelist.modesByName[value].mode;

        editor.session.setMode(mode);
      }
    });

    editor.setTheme("ace/theme/tomorrow_night");
  },

  computed: {
    activeSnippet() {
      return this.$store.state.activeSnippet;
    },
    ...mapGetters([
      'getActiveSnippet'
    ])
  },

  watch: {
    getActiveSnippet: function(newValue, oldValue) {
      const select = $('.ui.dropdown');
      const editor = ace.edit('editor');

      // Reset the content view for new snippet
      if (newValue && newValue.content === '') {
        editor.setValue('');
        select.dropdown('set value', newValue.language);
        select.dropdown('set text', newValue.languageFormatted);
      } else if (newValue) {
        editor.setValue(newValue.content);
        select.dropdown('set value', newValue.language);
        select.dropdown('set text', newValue.languageFormatted);
      }
    }
  },

  methods: {
    save() {
      const select = $('.ui.dropdown');
      const editor = ace.edit('editor');
      const active = this.$store.state.activeSnippet;
      const snippet = {
        content: editor.getValue(),
        title: active ? active.title : (this.title || 'No Title'),
        language: select.dropdown('get value') || 'text',
        languageFormatted: select.dropdown('get text') || 'Plain Text'
      };
      const id = Math.random().toString(36).replace(/[^a-z]+/g, '');

      if (snippet.content === '' && ! active) {
        return;
      }

      if (active && this.$store.getters.getSnippetById(active.id)) {
        Object.assign(active, snippet);
        this.$store.commit('updateSnippet', active);
        return;
      }

      if (! active) {
        snippet.id = id;
      }

      this.$store.commit('addSnippet', snippet);
    }
  }
};