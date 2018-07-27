import { getId } from './utils.js';

export function getDefaultSnippet() {
  return {
    files: [],
    title: '',
    content: '',
    id: getId(),
    language: '',
    isGist: false,
    isActive: true,
    isPinned: false,
    languageFormatted: ''
  };
};

export const defaultAuth = {
  auth: {
    avatar: '',
    token: null
  }
};