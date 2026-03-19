export interface IElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  isElectron: () => boolean;
  getItems: () => Promise<unknown[]>;
  updateItems: (items: unknown[]) => Promise<{ success: boolean }>;
  getSettings: () => Promise<unknown>;
  updateSettings: (settings: unknown) => Promise<{ success: boolean }>;
  reToggleWindow: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {};
