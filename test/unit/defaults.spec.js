import { getDefaultSnippet } from '../../src/utils/defaults.js';

describe('defaults', () => {
  describe('snippet', () => {
    it('should return an object', () => {
      expect(getDefaultSnippet()).to.be.an('object');
    });

    it('should have an id', () => {
      expect(getDefaultSnippet().id).to.exist;
      expect(getDefaultSnippet().id).to.be.a('string');
    });

    it('should have an empty string for the title', () => {
      expect(getDefaultSnippet().title).to.equal('');
    });

    it('should have an empty string for the content', () => {
      expect(getDefaultSnippet().content).to.equal('');
    });

    it('should have isActive set to true', () => {
      expect(getDefaultSnippet().isActive).to.equal(true);
    });

    it('should have isPinned set to false', () => {
      expect(getDefaultSnippet().isPinned).to.equal(false);
    });

    it('should have an empty string for the language', () => {
      expect(getDefaultSnippet().language).to.equal('');
    });

    it('should have an empty string for the formattedLanguage', () => {
      expect(getDefaultSnippet().languageFormatted).to.equal('');
    });
  });
});