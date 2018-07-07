import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import { getDefaultSnippet } from '../../src/defaults.js';
import Sidebar from '../../src/components/Sidebar/Sidebar.vue';

Vue.use(Vuex);

const pinnedSnippet = Object.assign({}, getDefaultSnippet());

pinnedSnippet.isPinned = true;

describe('Sidebar', () => {
  it('should render pinned snippets', () => {
    const wrapper = shallowMount(Sidebar, {
      computed: {
        pinnedSnippets: () => {
          return [ pinnedSnippet ];
        }
      }
    });

    expect(wrapper.findAll('.pinned-snippets a.pinned-item')).to.have.lengthOf(1);
  });

  describe('setLanguage()', () => {
    it('should set the store language to the text value of the button', () => {
      const wrapper = shallowMount(Sidebar, {
        computed: {
          pinnedSnippets: () => {
            return [ pinnedSnippet ];
          }
        },
        store: new Vuex.Store({
          state: {},
          mutations: {
            setLanguageFilter: () => {}
          }
        })
      });
      wrapper.find('.item .javascript').trigger('click');
      expect(wrapper.findAll('.active')).to.have.lengthOf(1);
    });
  });
});