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
      const rightPanel = $('.right-panel');

      if (! this.expandedView) {
        rightPanel.css({ left: '0', width: '100%', zIndex: '200'  });
      } else {
        rightPanel.css({ left: '30.2rem', width: 'calc(100% - 30.2rem)' });
      }

      ace.edit('content').focus();
      this.expandedView = !this.expandedView;
    }
  }
};