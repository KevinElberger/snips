export default {
  name: 'SnippetContainer',
  mounted: function() {
    const editor = ace.edit('editor');

    $('.ui.dropdown').dropdown();

    editor.setTheme("ace/theme/tomorrow_night");    
  }
};