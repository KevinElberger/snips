export default {
  name: 'Snippet',
  props: ['activeSnippet'],

  mounted: function() {
    const editor = ace.edit('content');
    const modelist = ace.require('ace/ext/modelist');
    const title = $('#title-wrapper input');
    
    editor.focus();

    title.on('input', function() {
      Object.keys(modelist.modesByName).forEach(modename => {
        const mode = modelist.modesByName[modename];

        if (mode.extRe.test($(this).val())) {
          editor.session.setMode(mode.mode);
        }
      });
    });

    editor.setTheme('ace/theme/tomorrow_night');
  }
};