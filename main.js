const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow (file) {
  // Create our initial window. This window will create other windows itself
  // using `window.open`. We need to enable the nativeWindowOpen feature
  // to get full access to this ability.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nativeWindowOpen: true,
    },
    frame: false,
    transparent: true,
  });

  // Load the first game's URL.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "game1.html"),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow("game1.html");
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});
