import { setEditorMode } from '../../utils/utils.js';

export default {
  name: 'Snippet',
  props: ['activeSnippet'],

  mounted: function() {
    const editor = ace.edit('content');
    const modelist = ace.require('ace/ext/modelist');
    const title = $('#title-wrapper input');
    
    editor.focus();

    title.on('input', function() {
      setEditorMode($(this).val());
    });

    editor.setTheme('ace/theme/tomorrow_night');

    $('.multiple.dropdown').dropdown();
  },
  
  computed: {
    labels() {
      return this.$store.state.labels;
    }
  }
};