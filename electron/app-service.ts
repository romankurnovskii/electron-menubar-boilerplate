import { ipcMain, app } from 'electron';
import Store from 'electron-store';

interface StoreSchema {
  items: unknown[];
  settings: Record<string, unknown>;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this.store as any)?.get('items') || [];
    });

    ipcMain.handle('update-items', (_event, items: unknown[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.store as any)?.set('items', items);
      return { success: true };
    });

    // Settings Handling
    ipcMain.handle('get-settings', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this.store as any)?.get('settings') || {};
    });

    ipcMain.handle('update-settings', (_event, settings: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = (this.store as any)?.get('settings') || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.store as any)?.set('settings', { ...current, ...settings });
      return { success: true };
    });
  }
}
