const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const path = require('path');
const reloader = require('electron-reload')(__dirname);
const Store = require('electron-store');
const storage = new Store();
require('dotenv').config();

let mainWindow;
const options = {
    width: 1200,
    height: 800,
    minWidth: 1100,
    minHeight: 650,
    show: false,
    webPreferences: {
        preload: path.join(__dirname, '/preload.js')
    },
    icon: path.join(__dirname, 'static/icons/png/64x64.png')
};

const platform = process.platform;

if (!storage.get('store')) {
    storage.set('store', {
        auth: {
            avatar: '',
            name: null,
            token: null
        },
        labels: [],
        snippets: []
    });
}

ipcMain.on('save-snippets', (event, data) => {
    storage.set('store', Object.assign(storage.get('store'), {
        snippets: data
    }));
});

ipcMain.on('save-auth', (event, data) => {
    storage.set('store', Object.assign(storage.get('store'), {
        auth: data
    }));
});

ipcMain.on('save-label', (event, data) => {
    storage.set('store', Object.assign(storage.get('store'), {
        labels: data
    }));
    storage.set('store', storage.get('store'));
});

function createWindow () {
    if (platform === 'darwin') {
        Object.assign(options, {
            frame: false,
            titleBarStyle: 'hidden'
        });
    }

    mainWindow = new BrowserWindow(options);

    // render index.html which will contain our root Vue component
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // send previously stored data to window
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('load-data', storage.get('store'));
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })

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