const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
let win;

function createWindow() {
  win = new BrowserWindow({width: 1200, height: 900});
  win.loadURL("file://" + __dirname + "/index.html");
  win.webContents.openDevTools();
  win.on("closed", () => win = null );
}

app.on("ready", createWindow);