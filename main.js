/*
 * @Date: 2021-01-23 21:46:30
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-01-24 15:05:21
 */
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain ,Menu} = require('electron')
const path = require('path')
const expressApp = require("./services/app")
const __CONF__ = require("./config/config.json");
app.disableHardwareAcceleration()
expressApp.listen(__CONF__["serverPort"])
const prefix = "ll-aclivechat"
const subWindows = []
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    title: `${prefix} 令和`
  })
  Menu.setApplicationMenu(null)
  // and load the index.html of the app.
  //   mainWindow.loadURL(`file://${__dirname}/frontend/dist/index.html`,{
  //     hash: 'main'
  // })
  mainWindow.loadURL(`http://localhost:8080`)
  //mainWindow.webContents.openDevTools();
  // Open the DevTools.
   mainWindow.webContents.openDevTools()

  ipcMain.on("applyCss", (ref,event) => {
    for (let index = 0; index < subWindows.length; index++) {
      if (subWindows[index].__TYPE__ === event.type) {
        subWindows[index].reload();
        break;
      }
    }
  })


  ipcMain.on("lockView", (ref,event) => {
    for (let index = 0; index < subWindows.length; index++) {
      if (subWindows[index].__TYPE__ === event.type) {
        subWindows[index].setIgnoreMouseEvents(event.option.locked);
        break;
      }
    }
  })

  ipcMain.on("alwaysTop", (ref,event) => {
    for (let index = 0; index < subWindows.length; index++) {
      if (subWindows[index].__TYPE__ === event.type) {
        subWindows[index].setAlwaysOnTop(event.option.alwaysTop);
        break;
      }
    }
  })

  ipcMain.on('openView', (ref, events) => {
    let newwin = new BrowserWindow({
      width: Number(events.option.width),
      height: Number(events.option.height),
      transparent: true,
      frame: false,
      title: `${prefix} ${events.type}`
      // modal: true,
      // show: false
    })
    newwin.setAlwaysOnTop(events.option.alwaysTop)
    newwin.__TYPE__ = events.type
    newwin.loadURL(events.url); //
    newwin.on('closed', () => { newwin = null })
    subWindows.push(newwin)
  }
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
