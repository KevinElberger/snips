import { shallowMount } from '@vue/test-utils';
import { snippet } from '../../src/defaults.js';
import MenuBar from '../../src/components/Menubar/Menubar.vue';

describe('Menubar', () => {
  it('should render all the menu buttons', () => {
    const wrapper = shallowMount(MenuBar, {
      propsData: { activeSnippet: snippet }
    });

    expect(wrapper.findAll('.menu-item')).to.have.lengthOf(4);
  });

  it('should initialize with expandedView as false', () => {
    const wrapper = shallowMount(MenuBar, {
      propsData: { activeSnippet: snippet }
    });

    expect(wrapper.vm.expandedView).to.equal(false);
  });

  describe('expandSnippetView()', () => {
    it('should set expandedView to true after it is called', () => {
      const wrapper = shallowMount(MenuBar, {
        propsData: { 
          activeSnippet: snippet 
        }
      });

      wrapper.vm.expandSnippetView();

      expect(wrapper.vm.expandedView).to.equal(true);
    });
  });
});