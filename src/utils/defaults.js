import { getId } from './utils.js';

export function getDefaultSnippet() {
  return {
    title: '',
    content: '',
    id: getId(),
    owner: 'You',
    isGist: false,
    isActive: true,
    isPinned: false,
    language: 'text',
    createdOn: new Date().toLocaleString()
  };
};

export const defaultAuth = {
  auth: {
    avatar: '',
    token: null
  }
};