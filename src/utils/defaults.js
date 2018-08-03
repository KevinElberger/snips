import { getId } from './utils.js';

export function getDefaultSnippet() {
  return {
    title: '',
    labels: [],
    content: '',
    id: getId(),
    owner: 'You',
    isGist: false,
    isActive: true,
    isPinned: false,
    language: 'text',
    lastUpdated: new Date(),
    createdOn: new Date().toLocaleString()
  };
};

export const defaultAuth = {
  auth: {
    avatar: '',
    token: null
  }
};