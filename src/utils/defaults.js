import { getId } from './utils.js';

export function getDefaultSnippet() {
  return {
    title: '',
    content: '',
    id: getId(),
    language: '',
    isActive: true,
    isPinned: false,
    languageFormatted: ''
  }
};