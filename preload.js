/*
 * @Date: 2021-01-23 21:46:30
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-02-18 02:33:19
 */
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.ipcRenderer = require('electron').ipcRenderer;
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
