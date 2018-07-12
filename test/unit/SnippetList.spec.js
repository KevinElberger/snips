import { shallowMount } from '@vue/test-utils';
import { getDefaultSnippet } from '../../src/utils/defaults.js';
import SnippetList from '../../src/components/SnippetList/SnippetList.vue';

const mockSnippets = [
  getDefaultSnippet(), getDefaultSnippet()
];

describe('SnippetList', () => {
  it('renders an anchor tag for each snippet', () => {
    const wrapper = shallowMount(SnippetList, {
      computed: {
        snippets: () => {
          return mockSnippets;
        }
      }
    });

    expect(wrapper.findAll('a')).to.have.lengthOf(mockSnippets.length);
  });

  it('renders the default message if no snippets exist', () => {
    const wrapper = shallowMount(SnippetList, {
      computed: {
        snippets: () => {
          return [];
        }
      }
    });
    
    expect(wrapper.findAll('.no-snippets')).to.have.lengthOf(1);
  });
});