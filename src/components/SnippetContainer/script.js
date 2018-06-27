import { mapGetters } from 'vuex';

export default {
  name: 'SnippetContainer',
  data() {
    const active = this.$store.state.activeSnippet;

    return {
      title: active ? active.title : '',
      content: active ? active.content : '',
      language: active ? active.language : '',
      isPinned: active ? active.isPinned : false,
      languageFormatted: active ? active.languageFormatted : ''
    };
  },

  computed: {
    activeSnippet() {
      return this.$store.state.activeSnippet;
    },
    activeIsPinned() {
      const active = this.$store.getters.getActiveSnippet;

      return active ? active.isPinned : false;
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
        this.reset(false);
      } else if (newValue) {
        this.update(newValue);
      }
    }
  },

  methods: {
    save() {
      const select = $('.ui.dropdown');
      const editor = ace.edit('editor');
      const active = this.$store.state.activeSnippet;
      const activeHasTitle = active && active.title !== '';
      const id = Math.random().toString(36).replace(/[^a-z]+/g, '');
      const snippet = {
        content: editor.getValue(),
        title: activeHasTitle ? active.title : this.title,
        language: select.dropdown('get value') || 'text',
        languageFormatted: select.dropdown('get text') || 'Plain Text',
        id: (active && active.id) ? active.id : id
      };

      if (snippet.content === '' && ! active) {
        return;
      }

      if (snippet.title === '') {
        snippet.title = 'Untitled Snippet';
      }

      if (active && this.$store.getters.getSnippetById(active.id)) {
        Object.assign(active, snippet);
        this.$store.commit('updateSnippet', active);
        return;
      }

      this.$store.commit('addSnippet', snippet);
    },

    del() {
      const editor = ace.edit('editor');
      const noContent = editor.getValue() === '';
      const active = this.$store.state.activeSnippet;
      const isInList = this.$store.getters.getSnippetById(active.id);

      if (noContent && (! active || ! isInList)) {
        return;
      }

      this.$store.commit('deleteSnippet', active);

      this.reset(true);
    },

    reset(addSnippet) {
      const select = $('.ui.dropdown');
      const editor = ace.edit('editor');
      const title = $('#title-wrapper input');

      title.val('');
      editor.setValue('');
      select.dropdown('set value', 'text');
      select.dropdown('set text', 'Plain Text');

      if (addSnippet) {
        this.$store.commit('setActiveSnippet', {
          title: '',
          content: '',
          isPinned: false,
          language: 'text',
          languageFormatted: 'Plain Text',
          id: Math.random().toString(36).replace(/[^a-z]+/g, '')
        }); 
      }
    },

    update(newSnippet) {
      const select = $('.ui.dropdown');
      const editor = ace.edit('editor');

      this.$store.commit('setActiveSnippet', newSnippet);

      editor.setValue(newSnippet.content);
      select.dropdown('set value', newSnippet.language);
      select.dropdown('set text', newSnippet.languageFormatted);
    },

    pin() {
      const editor = ace.edit('editor');
      const noContent = editor.getValue() === '';
      let active = this.$store.state.activeSnippet;
      const isInList = this.$store.getters.getSnippetById(active.id);

      if (! isInList || (noContent && ! active)) {
        return;
      } 

      if (! active.isPinned) {
        this.$store.commit('pinSnippet', true);
      } else {
        this.$store.commit('pinSnippet', false);
      }
    }
  }
};