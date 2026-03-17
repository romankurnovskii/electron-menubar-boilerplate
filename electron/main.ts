import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { AppService } from './app-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running in development mode
const isDev = !app.isPackaged;

let mainWindow: Electron.BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 400,
    minHeight: 600,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload/preload.cjs'),
      backgroundThrottling: false,
      devTools: true,
    },
  });

  // Load the app
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5174'
      : `file://${path.join(__dirname, '../index.html')}`
  );

  // Handle loading errors
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Ensure window is visible on all workspaces
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
}

function createTray() {
  const iconPath = isDev
    ? path.join(__dirname, '../../assets/icon.png')
    : path.join(__dirname, '../assets/icon.png');

  console.log('[Main] Loading tray icon from:', iconPath);

  // Use a high-quality, transparent SVG-based icon as default for the boilerplate
  // This guarantees it looks great on macOS dark/light mode and Windows
  const svgIcon = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="black"/>
    </svg>
  `;

  let icon = nativeImage.createFromPath(iconPath);

  if (icon.isEmpty()) {
    console.warn('[Main] icon.png not found or empty, using default SVG icon');
    icon = nativeImage.createFromBuffer(Buffer.from(svgIcon), { scaleFactor: 2.0 });
  } else {
    icon = icon.resize({ width: 22, height: 22 });
  }

  icon.setTemplateImage(true);
  tray = new Tray(icon);

  tray.setToolTip('Electron Menubar Boilerplate');

  tray.on('click', () => {
    toggleWindow();
  });
}

function toggleWindow() {
  if (mainWindow?.isVisible()) {
    mainWindow.hide();
  } else {
    showWindowAtTray();
  }
}

function showWindowAtTray() {
  if (!mainWindow || !tray) return;

  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Position window centered horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();

  if (process.platform === 'darwin') {
    app.focus({ steal: true });
  }
}

app.whenReady().then(async () => {
  // Hide the dock icon on macOS
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  createWindow();
  createTray();

  const appService = new AppService();
  await appService.init();
});

// Generic app navigation IPC
ipcMain.on('re-toggle-window', () => {
  toggleWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});