/**
 * Service to interact with Electron main process via IPC
 */
export interface BoilerplateItem {
  id: string;
  label: string;
  value: string;
  description?: string;
  timestamp: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  [key: string]: any;
}

export const electronService = {
  /**
   * Get the version of the application
   */
  getAppVersion: async (): Promise<string> => {
    if (window.electronAPI) {
      return await window.electronAPI.getAppVersion();
    }
    return '1.0.0 (Web)';
  },

  /**
   * Get the current platform
   */
  getPlatform: async (): Promise<string> => {
    if (window.electronAPI) {
      return await window.electronAPI.getPlatform();
    }
    return 'web';
  },

  /**
   * Check if running in Electron environment
   */
  isElectron: (): boolean => {
    return !!window.electronAPI;
  },

  /**
   * Get generic items from store
   */
  getItems: async (): Promise<BoilerplateItem[]> => {
    if (window.electronAPI) {
      return await window.electronAPI.getItems();
    }
    return [];
  },

  /**
   * Update items in store
   */
  updateItems: async (items: BoilerplateItem[]): Promise<{ success: boolean }> => {
    if (window.electronAPI) {
      return await window.electronAPI.updateItems(items);
    }
    return { success: false };
  },

  /**
   * Get app settings
   */
  getSettings: async (): Promise<AppSettings> => {
    if (window.electronAPI) {
      return await window.electronAPI.getSettings();
    }
    return { theme: 'system', notifications: true };
  },

  /**
   * Update app settings
   */
  updateSettings: async (settings: Partial<AppSettings>): Promise<{ success: boolean }> => {
    if (window.electronAPI) {
      return await window.electronAPI.updateSettings(settings);
    }
    return { success: false };
  },

  /**
   * Re-toggle the window
   */
  reToggleWindow: () => {
    if (window.electronAPI) {
      window.electronAPI.reToggleWindow();
    }
  }
};
