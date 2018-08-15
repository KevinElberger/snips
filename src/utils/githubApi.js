import axios from 'axios';
import isElectron from 'is-electron';
import { getId } from './utils.js';
import { store } from '../store.js';
import mockGists from '../../test/mockGists.js';
import mockComments from '../../test/mockGistComments.js';
import { makeRequest, makeAuthRequest } from './utils.js';

/**
 * Authenticates a GitHub User with an access token
 * and subsequently gets the User account and
 * Gists of the authenticated user
 * 
 * @param {object} authConfig 
 * @param {string} code 
 */
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

/**
 * Obtains the GitHub User who is currently authenticated
 * 
 * @param {string} token the auth token 
 */
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
  
          console.log(gists);

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

/**
 * Checks whether or not a Gist has a Star
 * by the authenticated user
 * 
 * @param {string} id the gist ID 
 * @param {string} token the auth token
 * @returns {boolean}
 */
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

/**
 * Adds a Star to a Gist with the given ID
 * 
 * @param {string} id the Gist ID 
 * @param {string} token the auth token
 */
export function starGist(id, token) {
  const method = 'PUT';
  const url = 'https://api.github.com/gists/' + id + '/star';

  return makeAuthRequest(url, method, token);
}

/**
 * Removes a Star from a Gist with the given ID
 * 
 * @param {string} id the Gist ID 
 * @param {string} token the auth token
 */
export function unstarGist(id, token) {
  const method = 'DELETE';
  const url = 'https://api.github.com/gists/' + id + '/star';

  return makeAuthRequest(url, method, token);
}

/**
 * Gets all comments from a Gist with the given ID
 * 
 * @param {string} id the Gist ID
 * @param {string} token the auth token
 */
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

/**
 * Updates a Gist's content, description, privacy
 * status, or removes a file, depending on
 * the provided content.
 * 
 * @param {string} id the Gist ID to patch
 * @param {string} token the auth token
 * @param {object} gists  the Gist files, description, and privacy status
 */
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

/**
 * Creates a Gist with the provided data
 * 
 * @param {string} token the auth token
 * @param {object} gistData the Gist data to post
 */
export function createGist(token, gistData) {
  const method = 'POST';
  const url = 'https://api.github.com/gists';
  const { filename } = gistData;
  const gist = Object.assign({}, {
    description: gistData.description,
    public: gistData.public,
    files: {
      filename: {
        content: gistData.content
      }
    }
  });

  return makeAuthRequest(url, method, token);
}