import React from 'react';
import { OngokuApp } from '../core/app';
import { AppReq } from '../core/app';
/**
 * App context state interface
 */
export interface AppContextState {
    ongokuApp: OngokuApp | null;
    loading: boolean;
    error: Error | null;
}
/**
 * Create a context for the app
 */
export declare const AppContext: React.Context<AppContextState>;
/**
 * App provider props
 */
export interface AppProviderProps {
    appReq: AppReq;
    apiEndpoint?: string;
    authToken?: string;
    children?: React.ReactNode;
    applyOverrides?: (app: OngokuApp) => Promise<OngokuApp>;
}
/**
 * Framework-agnostic app provider component
 */
export declare const AppProvider: React.FC<AppProviderProps>;
/**
 * Custom hook to use the app context
 */
export declare const useApp: () => AppContextState;
/**
 * Higher-order component that requires Ongoku app access
 */
export declare function withApp<P extends object>(Component: React.ComponentType<P & {
    ongokuApp: OngokuApp;
}>): React.FC<P>;
