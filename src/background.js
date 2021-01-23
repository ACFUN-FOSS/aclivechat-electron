/*
 * @Date: 2020-09-15 19:39:14
 * @LastEditors: kanoyami
 * @LastEditTime: 2020-09-16 20:43:20
 */
"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { turn } from "core-js/fn/array";
import server from "./server/server"
const isDevelopment = process.env.NODE_ENV !== "production";
// const AcClient = require("ac-danmu")
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
var AcClient = require("ac-danmu");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // let a = new AcClient()
  // Create the browser window.
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
    },
  });
  server()
  win.loadURL("http://localhost:3000");
  // if (process.env.WEBPACK_DEV_SERVER_URL) {
  //   // Load the url of the dev server if in development mode
  //   win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  //   if (!process.env.IS_TEST) win.webContents.openDevTools();
  // } else {
  //   createProtocol("app");
  //   // Load the index.html when not in development
  //   win.loadURL("app://./index.html");
  // }
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
  AcClient("93482").then((ac_client) => {
    //启动websocket连接
    ac_client.wsStart();
    ac_client.on("enter", () => {
      console.log("Enter room success!");
    });
    ac_client.on("recent-comment", (commmnets) => {
      console.log(commmnets);
    });
    ac_client.on("danmaku", (danmaku) => {
      console.log(danmaku);
    });
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
