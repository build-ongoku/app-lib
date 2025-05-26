export * from './core';
export * from './providers';
export * from './ui';
export * from './utils';
export interface AppConfig {
    name: string;
    version: string;
    description?: string;
}
export declare const VERSION = "0.1.0";
export declare const formatDate: (date: Date) => string;
export declare const generateId: () => string;
export declare const getAppVersion: (config: AppConfig) => string;
export declare const getAppInfo: (config: AppConfig) => string;
export declare const createAppProvider: (config: AppConfig) => {
    appConfig: AppConfig;
};
export declare const useApp: (provider: {
    appConfig: AppConfig;
}) => AppConfig;
