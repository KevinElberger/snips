import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import { getDefaultSnippet } from '../../src/defaults.js';
import App from '../../src/components/App/App.vue';

Vue.use(Vuex);

describe('App', () => {
  it('sets the correct default data', () => {
    expect(typeof App.data).to.equal('function');
    const defaultData = App.data();
    expect(defaultData.title).to.equal('Untitled Snippet');
    expect(defaultData.content).to.equal('');
    expect(defaultData.text).to.equal('text');
    expect(defaultData.plainText).to.equal('Plain Text');
  });

  describe('togglePin', () => {
    it('should toggle activeSnippet.isPinned', () => {
      const wrapper = shallowMount(App);
      wrapper.vm.$notify = () => {};
      expect(wrapper.vm.activeSnippet.isPinned).to.equal(false);
      wrapper.vm.togglePin();
      expect(wrapper.vm.activeSnippet.isPinned).to.equal(true);
    });
  });

  describe('setLanguageFilter', () => {
    it('should set the language to the given text', () => {
      const wrapper = shallowMount(App);
      wrapper.vm.setLanguageFilter({ innerText: 'JavaScript' });
      expect(wrapper.vm.language).to.equal('JavaScript');
    });
  });

  describe('resetActiveSnippet', () => {
    it('should reset the activeSnippet to default values', () => {
      const wrapper = shallowMount(App, {
        store: new Vuex.Store({
          state: { snippets: [] },
          mutations: {
            setLanguageFilter: () => {}
          }
        })
      });
      wrapper.vm.editor = { setValue: () => {} };
      wrapper.vm.language = { dropdown: () => {} };
      wrapper.vm.activeSnippet.title = 'Test';
      wrapper.vm.resetActiveSnippet();
      expect(wrapper.vm.activeSnippet.title).to.equal('');
    });
  });
});