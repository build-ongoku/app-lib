import { App, AppReq } from '../../../common/app_v3';
import React from 'react';
export declare const LayoutRootPrivateAppInfo: (props: {
    appReq: AppReq;
    applyOverrides?: (appInfo: App) => Promise<App>;
    children: React.ReactNode;
}) => React.JSX.Element;
