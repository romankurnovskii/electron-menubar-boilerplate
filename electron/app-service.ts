import { app, ipcMain } from 'electron'
import Store from 'electron-store'

interface StoreSchema {
  items: unknown[]
  settings: Record<string, unknown>
}

export class AppService {
  private store: Store<StoreSchema> | null = null

  async init(): Promise<void> {
    this.store = new Store<StoreSchema>({
      defaults: {
        items: [],
        settings: {
          theme: 'system',
          notifications: true,
        },
      },
    })

    this.setupIpc()
    console.log('🚀 [AppService] Initialized generic boilerplate service')
  }

  private setupIpc(): void {
    // Basic App Info
    ipcMain.handle('get-app-version', () => app.getVersion())
    ipcMain.handle('get-platform', () => process.platform)

    // Generic Data Handling
    ipcMain.handle('get-items', () => {
      return this.store?.get('items') || []
    })

    ipcMain.handle('update-items', (_event, items: unknown[]) => {
      this.store?.set('items', items)
      return { success: true }
    })

    // Settings Handling
    ipcMain.handle('get-settings', () => {
      return this.store?.get('settings') || {}
    })

    ipcMain.handle('update-settings', (_event, settings: Record<string, unknown>) => {
      const current = this.store?.get('settings') || {}
      this.store?.set('settings', { ...current, ...settings })
      return { success: true }
    })
  }
}
