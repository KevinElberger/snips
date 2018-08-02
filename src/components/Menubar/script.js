export default {
  name: 'Menubar',
  props: [ 'activeSnippet' ],
  data() {
    return {
      expandedView: false
    }
  },
  mounted() {
    const store = this.$store;
    $('#snippet-search input').on('input', function() {
      const search = $(this).val();
      store.commit('search', search);
    });
  },
  methods: {
    expandSnippetView() {
      const header = $('#header');
      const snippetView = $('#snippet-container');

      if (! this.expandedView) {
        header.css({ marginLeft: '0', width: '100%' });
        snippetView.css({ marginLeft: '0', width: '100%', zIndex: '101' });
      } else {
        header.css({ marginLeft: '29.2rem', width: 'calc(100% - 29.2rem)' });
        snippetView.css({ marginLeft: '29.2rem', width: 'calc(100% - 29.2rem)', zIndex: '0' });
      }

      ace.edit('content').focus();
      this.expandedView = !this.expandedView;
    }
  }
};