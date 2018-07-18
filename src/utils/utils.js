import axios from 'axios';
import Constants from './constants.js';
import { store } from '../store.js';
import isElectron from 'is-electron';

const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const ipcRenderer = window.ipcRenderer;

export function getId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

export function notifySave(title) {
  this.$notify({
    group: 'alerts',
    title: 'Snippet Saved',
    text: `${title} was saved!`
  });
}

export function notifyPin(title = 'Untitled Snippet', isPinned) {
  const pinned = isPinned ? 'pinned' : 'un-pinned';

  this.$notify({
    group: 'alerts',
    title: 'Snippet Pinned',
    text: `${title} was ${pinned}!`
  });
}

export function notifyDelete(title) {
  this.$notify({
    group: 'alerts',
    title: 'Snippet Deleted',
    text: `${title} was deleted!`
  });
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
  const params = '?client_id=' + Constants.AUTH_OPTIONS.clientId + '&scope=["gists"]';
  const githubUrl = rootUrl + params;

  window.loadURL(githubUrl);

  function handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      window.destroy();
    }

    if (code) {
      loginUser(Constants.AUTH_OPTIONS, code);
    } else {
      alert(
        "Something went wrong and we couldn't " +
          "log you into Github. Please try again."
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

function loginUser(authConfig, code) {
  const { hostname } = authConfig;
  const method = 'POST';
  const url = `https://${hostname}/login/oauth/access_token`;
  const redirect_uri = 'https://github.com/login/oauth/success';
  const data = {
    code: code,
    redirect_uri: redirect_uri,
    client_id: authConfig.clientId,
    client_secret: authConfig.clientSecret
  };

  return makeRequest(url, method, data)
    .then(function(response) {
      getUserAvatar(response.data.access_token);
    }).catch(function(error) {
      console.log('Login failure: ', error);
    });
}

export function logoutUser() {
  store.commit('logout', {
    avatar: '',
    token: null,
    loggedIn: false
  });
}

function getUserAvatar(token) {
  const method = 'GET';
  const url = 'https://api.github.com/user';

  return makeAuthRequest(url, method, token)
    .then(function(response) {
      const data = {
        token: token,
        avatar: response.data.avatar_url
      };

      store.commit('login', data);

      if (isElectron()) {
        ipcRenderer.send('save-auth', data);        
      }  
    }).catch(function(error) {
      console.log('Get user avatar failure: ', error);
    });
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
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  return axios({ method, url, data });
}