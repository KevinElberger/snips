import { getId } from './utils.js';

export function getDefaultSnippet() {
  return {
    title: '',
    content: '',
    id: getId(),
    isGist: false,
    isActive: true,
    isPinned: false,
  };
};

export const defaultAuth = {
  auth: {
    avatar: '',
    token: null
  }
};