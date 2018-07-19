import isElectron from 'is-electron';
import { store } from '../store.js';
import { makeRequest, makeAuthRequest } from './utils.js';

export function loginUser(authConfig, code) {
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
      getUser(response.data.access_token);
    }).catch(function(error) {
      console.log('Login failure: ', error);
    });
}

export function getUser(token) {
  const method = 'GET';
  const url = 'https://api.github.com/user';

  return makeAuthRequest(url, method, token)
    .then(function(response) {
      const data = {
        token: token,
        name: response.data.name,
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

export function getGists() {
  const method = 'GET';
  const url = 'https://api.github.com/gists';

  return makeAuthRequest(url, method, token)
    .then(function(response) {
      // Modify gists here
    }).catch(function(error) {
      console.log('Could not get gists: ', error);
    });
}