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

export function getDefaultGist(owner) {
  return {
    labels: [],
    id: getId(),
    isGist: true,
    owner: owner,
    newGist: true,
    gistID: '',
    isActive: false,
    isPinned: false,
    toDelete: false,
    comments: [],
    starred: false,
    public: 'public',
    createdOn: new Date().toLocaleString(),
    title: '',
    content: '',
    filename: '',
    description: '',
    language: 'text'
  }
};

export const defaultAuth = {
  auth: {
    avatar: '',
    token: null
  }
};