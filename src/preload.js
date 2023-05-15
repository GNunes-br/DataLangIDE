const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openCodeFile: () => ipcRenderer.invoke("dialog:openCodeFile"),
  saveCodeFile: (content) => ipcRenderer.invoke("dialog:saveCodeFile", content),
  runCodeFile: (path) => ipcRenderer.invoke("runCodeFile", path),
});
