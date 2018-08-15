import axios from 'axios';
import isElectron from 'is-electron';
import { getId } from './utils.js';
import { store } from '../store.js';
import mockGists from '../../test/mockGists.js';
import mockComments from '../../test/mockGistComments.js';
import { makeRequest, makeAuthRequest } from './utils.js';

export function loginUser(authConfig, code) {
  const { hostname } = authConfig;
  const method = 'POST';
  const url = `https://${hostname}/login/oauth/access_token`;
  const data = {
    code: code,
    client_id: authConfig.clientId,
    client_secret: authConfig.clientSecret
  };

  return makeRequest(url, method, data)
    .then(function(response) {
      getUser(response.data.access_token)
        .then(getGists(response.data.access_token)
          .then(gists => {
            store.commit('addGists', gists);
          }));
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
        name: response.data.login,
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

/**
 * Gets all private and public User Gists,
 * transforms each file in a gist into
 * a snippet, each of which are tied
 * together via their Gist ID
 * 
 * @param {string} token 
 */
export function getGists(token) {
  const method = 'GET';
  const url = 'https://api.github.com/gists';

  return new Promise((resolve, reject) => {
    const gists = [];

    mockGists.forEach(gist => {
      const owner = gist.owner ? gist.owner.login : 'You';
      const createdOn = new Date(gist.created_at).toLocaleString();
      
      checkIfStarred(gist.id, token).then(response => {

        getGistComments(gist.id, token).then(comments => {

          Object.keys(gist.files).map(file => {
            const snippet = gist.files[file];
    
            gists.push({
              labels: [],
              id: getId(),
              isGist: true,
              owner: owner,
              newGist: false,              
              gistID: gist.id,
              isActive: false,
              isPinned: false,
              toDelete: false,
              comments: comments,
              starred: response,
              public: gist.public,
              createdOn: createdOn,
              title: snippet.filename,
              content: snippet.content,
              filename: snippet.filename,
              description: gist.description || '',
              language: snippet.language || 'text'
            });
          });
  
          setTimeout(resolve, 100, gists);   
        });     
      });
    });
  });

  // return makeAuthRequest(url, method, token)
  //   .then(function(response) {
  //     const getAllGistsRequests = response.data.map(gist => {
  //       return makeAuthRequest(`${url}/${gist.id}`, method, token);
  //     });
      
  //     axios.all(getAllGistsRequests)
  //       .then(function(result) {
  //         // Map gists here
  //         const gists = result.map(gist => gist.data.files);

  //         console.log('the gists are: ');
  //         console.log(gists);
  //       });
      
  //   }).catch(function(error) {
  //     console.log('Could not get gists: ', error);
  //   });
}

export function checkIfStarred(id, token) {
  const method = 'GET';
  const url = 'https://api.github.com/gists/' + id + '/star';

  let isStarred = false;

  return makeAuthRequest(url, method, token).then(response => {
    isStarred = true;

    return isStarred;
  })
  .catch(err => {
    if (err) {
      isStarred = false;
    }

    return isStarred;
  });
}

export function starGist(id, token) {
  const method = 'PUT';
  const url = 'https://api.github.com/gists/' + id + '/star';

  return makeAuthRequest(url, method, token);
}

export function unstarGist(id, token) {
  const method = 'DELETE';
  const url = 'https://api.github.com/gists/' + id + '/star';

  return makeAuthRequest(url, method, token);
}

export function getGistComments(id, token) {
  const method = 'GET';
  const url = 'https://api.github.com/gists/' + id + 'comments';

  return new Promise((resolve, reject) => {
    const comments = [];

    mockComments.forEach(comment => {
      comments.push({
        id: comment.id,
        body: comment.body,
        login: comment.user.login,
        url: comment.user.html_url,
        created_at: comment.created_at,
        avatar_url: comment.user.avatar_url
      })
    });

    setTimeout(resolve, 100, comments);
  });
  // return makeAuthRequest(url, method, token);
}

// Updates or deletes a file from a Gist
export function patchGist(id, token, gists) {
  const method = 'PATCH';
  const url = 'https://api.github.com/gists/' + id;
  let data = null;

  if (gists) {
    data = {
      description: gists[0].description,
      public: gists[0].public,
      files: {}
    };

    gists.forEach(gist => {
      data.files[gist.title] = gist.toDelete ? null : gist;
    });
  }

  return makeAuthRequest(url, method, token, data);
}

export function createGist(token, gist) {

}