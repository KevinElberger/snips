export default {
  name: 'Snippet',
  props: ['activeSnippet'],

  mounted: function() {
    const editor = ace.edit('content');
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
  }
};