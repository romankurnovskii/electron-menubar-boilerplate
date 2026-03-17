export interface IElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  isElectron: () => boolean;
  getItems: () => Promise<any[]>;
  updateItems: (items: any[]) => Promise<{ success: boolean }>;
  getSettings: () => Promise<any>;
  updateSettings: (settings: any) => Promise<{ success: boolean }>;
  reToggleWindow: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {};
