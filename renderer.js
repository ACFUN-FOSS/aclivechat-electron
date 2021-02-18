/*
 * @Date: 2021-01-23 21:46:30
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-02-18 12:40:05
 */
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const webview = document.querySelector("webview");

window.ipcRenderer.on('targetURL', (e, v) => {
   console.log(e)
   console.log(v.targetURL)
   webview.setAttribute("style", `width:${v.width}px;height:${v.height}px`)
   document.getElementById("content").setAttribute("style", `background:${v.officialBackgroundColor}`)
   webview.loadURL(v.targetURL)
})