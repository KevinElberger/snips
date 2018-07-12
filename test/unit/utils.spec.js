import { getId } from '../../src/utils/utils.js';

const chai = require('chai')

describe('utils', () => {
  describe('getId', () => {
    it('should return a string', () => {
      expect(getId()).to.be.a('string');
    });

    it('should not contain any numbers in the string', () => {
      expect(getId()).to.match(/[^0-9]/);
    });
  });
});