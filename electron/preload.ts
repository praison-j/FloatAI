import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  setAlwaysOnTop: (flag: boolean) => ipcRenderer.send('set-always-on-top', flag),
  setWindowOpacity: (opacity: number) => ipcRenderer.send('set-window-opacity', opacity),
  shrinkToIcon: () => ipcRenderer.send('shrink-to-icon'),
  restoreMainWindow: () => ipcRenderer.send('restore-main-window'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateStatus: (callback: (event: Electron.IpcRendererEvent, payload: any) => void) => {
    ipcRenderer.on('update-status', callback);
    return () => ipcRenderer.removeListener('update-status', callback);
  },
  isElectron: () => ipcRenderer.invoke('is-electron'),
});
