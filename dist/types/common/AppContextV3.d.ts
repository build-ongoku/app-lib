import React from 'react';
import { App, AppReq } from './app_v3';
export interface IAppContext {
    appInfo: App | null;
}
export declare const AppContext: React.Context<IAppContext>;
export declare const AppProvider: (props: {
    appReq: AppReq;
    applyOverrides?: (appInfo: App) => Promise<App>;
    children?: React.ReactNode;
}) => React.ReactNode;
