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
    createdOn: new Date().toLocaleString()
  };
};

export const defaultAuth = {
  auth: {
    avatar: '',
    token: null
  }
};