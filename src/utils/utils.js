import constants from './constants.js';

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
  const params = 'client_id=' + AUTH_OPTIONS.clientId + '&scope=["gists"]';
  const githubUrl = rootUrl + params;

  window.loadUrl(githubUrl);

  function handleCallback(url) {
    const raw_code = /code=([^&]*)/.exec(url) || null;
    const code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      window.destroy();
    }

    if (code) {
      loginUser(authConfig, code);
    } else {
      this.$notify({
        group: 'alerts',
        title: 'Error',
        text: "Something went wrong and we couldn't " +
          "log you into Github. Please try again."
      });
    }
  }

  window.on('close', () => {
    window.destroy();
  });

  window.webContents.on('will-navigate', function(event, url) {
    handleCallback(url);
  });

  window.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
    handleCallback(newUrl);
  });
}

function loginUser(authConfig, code) {

}