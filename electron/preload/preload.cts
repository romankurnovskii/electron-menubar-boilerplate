const { contextBridge, ipcRenderer } = require('electron');

// Expose a simple API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  isElectron: () => true,
  
  // Generic Item Management
  getItems: () => ipcRenderer.invoke('get-items'),
  updateItems: (items: any[]) => ipcRenderer.invoke('update-items', items),
  
  // Settings Management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings),
  
  // Window Control
  reToggleWindow: () => ipcRenderer.send('re-toggle-window'),
});