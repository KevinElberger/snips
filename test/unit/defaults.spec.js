import { snippet } from '../../src/defaults.js';

describe('defaults', () => {
  describe('snippet', () => {
    it('should be an object', () => {
      expect(snippet).to.be.an('object');
    });

    it('should have an id', () => {
      expect(snippet.id).to.exist;
      expect(snippet.id).to.be.a('string');
    });

    it('should have an empty string for the title', () => {
      expect(snippet.title).to.equal('');
    });

    it('should have an empty string for the content', () => {
      expect(snippet.content).to.equal('');
    });

    it('should have isActive set to true', () => {
      expect(snippet.isActive).to.equal(true);
    });

    it('should have isPinned set to false', () => {
      expect(snippet.isPinned).to.equal(false);
    });

    it('should have an empty string for the language', () => {
      expect(snippet.language).to.equal('');
    });

    it('should have an empty string for the formattedLanguage', () => {
      expect(snippet.languageFormatted).to.equal('');
    });
  });
});