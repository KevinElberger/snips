import { shallowMount } from '@vue/test-utils';
import { snippet } from '../../src/defaults.js';
import SnippetList from '../../src/components/SnippetList/SnippetList.vue';

const mockSnippets = [
  snippet, snippet
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
});