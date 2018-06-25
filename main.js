const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const reloader = require('electron-reload')(__dirname);

let mainWindow;
let options = {
    width: 1200,
    height: 800
};

const platform = process.platform;

function createWindow () {
    // create the browser window

    if (platform === 'darwin') {
        options = Object.assign(options, {
            frame: false,
            titleBarStyle: 'hidden'
        });
    }

    mainWindow = new BrowserWindow(options);

    // render index.html which will contain our root Vue component
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // dereference the mainWindow object when the window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

// call the createWindow() method when Electron has finished initializing
app.on('ready', createWindow);

// when all windows are closed, quit the application on Windows/Linux
app.on('window-all-closed', function () {
    // only quit the application on OS X if the user hits cmd + q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // re-create the mainWindow if the dock icon is clicked in OS X and no other
    // windows were open
    if (mainWindow === null) {
        createWindow();
    }
});