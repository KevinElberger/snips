export default {
  name: 'Menubar',
  props: [ 'activeSnippet' ],
  data() {
    return {
      expandedView: false
    }
  },
  methods: {
    expandSnippetView() {
      const header = $('#header');
      const snippetView = $('#snippet-container');

      if (! this.expandedView) {
        header.css({ marginLeft: '0', width: '100%' });
        snippetView.css({ marginLeft: '0', width: '100%', zIndex: '101' });
      } else {
        header.css({ marginLeft: '30rem', width: 'calc(100% - 30rem)' });
        snippetView.css({ marginLeft: '30rem', width: 'calc(100% - 30rem)', zIndex: '0' });
      }

      ace.edit('content').focus();
      this.expandedView = !this.expandedView;
    }
  }
};