import { ipcMain, app } from 'electron';
import Store from 'electron-store';

interface StoreSchema {
  items: any[];
  settings: Record<string, any>;
}

export class AppService {
  private store: Store<StoreSchema> | null = null;

  constructor() {}

  async init(): Promise<void> {
    this.store = new Store<StoreSchema>({
      defaults: {
        items: [],
        settings: {
          theme: 'system',
          notifications: true
        }
      }
    });

    this.setupIpc();
    console.log('🚀 [AppService] Initialized generic boilerplate service');
  }

  private setupIpc(): void {
    // Basic App Info
    ipcMain.handle('get-app-version', () => app.getVersion());
    ipcMain.handle('get-platform', () => process.platform);

    // Generic Data Handling
    ipcMain.handle('get-items', () => {
      return (this.store as any)?.get('items') || [];
    });

    ipcMain.handle('update-items', (_event, items: any[]) => {
      (this.store as any)?.set('items', items);
      return { success: true };
    });

    // Settings Handling
    ipcMain.handle('get-settings', () => {
      return (this.store as any)?.get('settings') || {};
    });

    ipcMain.handle('update-settings', (_event, settings: Record<string, any>) => {
      const current = (this.store as any)?.get('settings') || {};
      (this.store as any)?.set('settings', { ...current, ...settings });
      return { success: true };
    });
  }
}
