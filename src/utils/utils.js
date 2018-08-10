import axios from 'axios';
import Constants from './constants.js';
import { store } from '../store.js';
import isElectron from 'is-electron';
import { loginUser } from './githubApi.js';

const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const ipcRenderer = window.ipcRenderer;

export function getId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

export function getRandomColor() {
  let color = '';

  // Decimal form of #FFFFFF
  const MAX_RGB_COLOR = 16777215;

  while (color.length < 6) {
    color = Math.floor(Math.random() * MAX_RGB_COLOR).toString(16);
  }

  return '#' + color;
}

export function isValidHex(string) {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string);
}

export function notify(options) {
  this.$notify({
    group: options.group,
    title: options.title || 'Untitled Snippet',
    text: options.text
  });
}

export function deleteAppliedLabel(label, deleteAll) {
  const labelDropdown = $('.multiple.dropdown');

  if (deleteAll) {
    labelDropdown.dropdown('clear');
    labelDropdown.dropdown('restore default text');
  } else {
    labelDropdown.dropdown('remove selected', label);
  }
}

export function resetPrivacyDropdown() {
  const privacyDropdown = $('#gist-privacy');
  const selected = privacyDropdown.dropdown('get value');
  
  privacyDropdown.dropdown('remove selected', selected);
}

export function getAppliedLabels() {
  return $('.multiple.dropdown input').val().split(',');
}

export function setActiveLabels(labels) {
  const labelDropdown = $('.multiple.dropdown');

  labelDropdown.dropdown('set selected', labels.map(label => {
    return label.name;
  }));
}

export function authenticateGithub() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  const rootUrl = 'https://github.com/login/oauth/authorize';
  const params = '?client_id=' + Constants.AUTH_OPTIONS.clientId + '&scope=gist';
  const githubUrl = rootUrl + params;

  window.loadURL(githubUrl);

  // Force re-authentication
  window.webContents.session.clearStorageData();

  function handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (error) {
      window.destroy();
    }

    if (code) {
      window.destroy();
      loginUser(Constants.AUTH_OPTIONS, code);
    } else if (error) {
      alert(
        'Something went wrong and we couldn\'t ' +
        'log you into Github. Please try again.'
      );
    }
  }

  window.on('close', window.destroy);

  window.webContents.on('will-navigate', function(event, url) {
    handleCallback(url);
  });

  window.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
    handleCallback(newUrl);
  });
}

export function logoutUser() {
  store.commit('logout', {
    avatar: '',
    name: null,
    token: null,
    loggedIn: false
  });
}

export function setEditorMode(string) {
  const editor = ace.edit('content');
  const modelist = ace.require('ace/ext/modelist');
  
  Object.keys(modelist.modesByName).forEach(name => {
    const mode = modelist.modesByName[name];

    if (mode.extRe.test(string)) {
      editor.session.setMode(mode.mode);
    }
  });

  // Default to text if no filename is present
  if (! string.includes('.')) {
    editor.session.setMode(modelist.modesByName['text'].mode);
  }
}

export function getLanguageByFile(string) {
  let language = '';
  const modelist = ace.require('ace/ext/modelist');
  const fileName = string.substr(string.indexOf('.'), string.length);  

  Object.keys(modelist.modesByName).forEach(name => {
    const mode = modelist.modesByName[name];

    if (mode.extRe.test(string)) {
      language = mode.name;
    }

    // Patch for Django file extensions
    if (fileName.toLowerCase() === '.html') {
      language = 'html';
    }
  });

  if (language === '') language = 'text';

  return language;
}

export function makeRequest(url, method, data = {}) {
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  return axios({ method, url, data });
}

export function makeAuthRequest(url, method, token, data = {}) {
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['Authorization'] = `token ${token}`;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  return axios({ method, url, data });
}