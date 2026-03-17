
export interface BoilerplateItem {
    id: string;
    label: string;
    value: string;
    description?: string;
    timestamp: number;
}

export const APP_CONFIG = {
    DEFAULT_SIZE: { width: 400, height: 600 },
    REFRESH_INTERVAL_MS: 30000,
} as const;
