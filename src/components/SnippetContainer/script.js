export default {
  name: 'SnippetContainer',
  mounted: function() {
    const editor = ace.edit('editor');
    const modelist = ace.require("ace/ext/modelist");

    $('.ui.dropdown').dropdown({
      onChange: function(value, text, item) {
        const mode = modelist.modesByName[value].mode;

        editor.session.setMode(mode);
      }
    });

    editor.setTheme("ace/theme/tomorrow_night");
  }
};