export default {
  name: 'Menubar',
  props: [ 'activeSnippet' ],
  data() {
    return {
      expandedView: false
    }
  },
  mounted() {
    this.initPopups();
    $('#extras').dropdown();
    $('#new').dropdown({
      action: 'hide'
    });
  },

  methods: {
    expandSnippetView() {
      const rightPanel = $('.right-panel');
      const titlebarLeft = $('#left');
      const titlebarMid = $('#middle');

      if (! this.expandedView) {
        titlebarLeft.css({ background: '#fff' });
        titlebarMid.css({ background: '#fff' });
        rightPanel.css({ left: '0', width: '100%', zIndex: '200'  });
      } else {
        titlebarLeft.css({ background: '#1b1c1d' });
        titlebarMid.css({ background: '#f8f8f8' });
        rightPanel.css({ left: '30.2rem', width: 'calc(100% - 30.2rem)' });    
      }

      ace.edit('content').focus();
      this.expandedView = !this.expandedView;
    },

    search(event) {
      const store = this.$store;      
      const search = event.target.value;
      store.commit('search', search);
    },

    showAboutModal() {
      $('#about').modal('show');
    },

    initPopups() {
      $('#save').popup({
        variation: 'inverted',
        delay: { show: 300 },
        position : 'bottom center',
        content  : 'Save this snippet'
      });

      $('#del').popup({
        variation: 'inverted',
        delay: { show: 300 },
        position : 'bottom center',
        content  : 'Delete this snippet'
      });

      $('#pin').popup({
        variation: 'inverted',
        delay: { show: 300 },
        position : 'bottom center',
        content  : 'Pin this snippet'
      });

      $('#expand').popup({
        variation: 'inverted',
        delay: { show: 300 },
        position : 'bottom center',
        content  : 'Expand snippet view'
      });
    }
  }
};