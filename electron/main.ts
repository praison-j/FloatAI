import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let iconWindow: BrowserWindow | null = null;

function sendUpdateStatus(status: string, details: any = {}) {
  [mainWindow, iconWindow].forEach((window) => {
    if (window?.webContents) {
      window.webContents.send('update-status', { status, ...details });
    }
  });
}

function createWindow() {
  autoUpdater.autoDownload = false;

  autoUpdater.on('checking-for-update', () => {
    sendUpdateStatus('checking');
  });

  autoUpdater.on('update-available', (info) => {
    sendUpdateStatus('update-available', info);
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on('update-not-available', () => {
    sendUpdateStatus('update-not-available');
  });

  autoUpdater.on('download-progress', (progress) => {
    sendUpdateStatus('download-progress', progress);
  });

  autoUpdater.on('update-downloaded', () => {
    sendUpdateStatus('update-downloaded');
    // Install automatically after the update has fully downloaded.
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 1000);
  });

  autoUpdater.on('error', (error) => {
    sendUpdateStatus('error', { message: error == null ? 'Unknown error' : error.message });
  });

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Frameless window for premium design
    transparent: false, // Can't be transparent if we want frame transitions or webviews inside (webviews don't support transparent windows well in some configurations)
    backgroundColor: '#0a0a0c', // Dark background to prevent white flash
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Crucial for embedding external AI websites
    },
  });

  // Load the app
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open devtools in dev mode if needed
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Open links in external browser instead of webview
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('http://localhost') && !url.includes('chatgpt.com') && !url.includes('perplexity.ai') && !url.includes('gemini.google.com') && !url.includes('claude.ai')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createIconWindow() {
  if (iconWindow) {
    iconWindow.show();
    return;
  }

  const isDev = !app.isPackaged;
  iconWindow = new BrowserWindow({
    width: 120,
    height: 120,
    minWidth: 100,
    minHeight: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    iconWindow.loadURL('http://localhost:5173/?mode=icon');
  } else {
    iconWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { mode: 'icon' } });
  }

  iconWindow.on('closed', () => {
    iconWindow = null;
  });
}

app.whenReady().then(() => {
  // Allow Electron to display webviews properly
  app.commandLine.appendSwitch('ignore-certificate-errors');

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC IPC Event Handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('set-always-on-top', (event, flag: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(flag, 'screen-saver');
  }
});

ipcMain.on('set-window-opacity', (event, opacity: number) => {
  if (mainWindow) {
    mainWindow.setOpacity(opacity);
  }
});

ipcMain.handle('check-for-updates', async () => {
  if (!app.isPackaged) {
    sendUpdateStatus('dev-mode');
    return { success: false, message: 'Auto-update is disabled in development mode.' };
  }
  try {
    await autoUpdater.checkForUpdates();
    return { success: true };
  } catch (error: any) {
    const message = error?.message || 'Unable to check for updates.';
    sendUpdateStatus('error', { message });
    return { success: false, message };
  }
});

ipcMain.on('shrink-to-icon', () => {
  if (mainWindow) {
    mainWindow.hide();
    createIconWindow();
  }
});

ipcMain.on('restore-main-window', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createWindow();
  }

  if (iconWindow) {
    iconWindow.close();
    iconWindow = null;
  }
});

// Expose whether we are running in Electron
ipcMain.handle('is-electron', () => {
  return true;
});
