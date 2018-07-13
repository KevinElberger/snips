import Constants from './constants.js';
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

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

    // if (code) {
    //   loginUser(authConfig, code);
    // } else {
    //   alert(
    //     "Something went wrong and we couldn't " +
    //       "log you into Github. Please try again."
    //   );
    // }
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

}