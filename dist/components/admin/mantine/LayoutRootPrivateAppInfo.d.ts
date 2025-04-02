import { App, AppReq } from '../../../common/app_v3';
import React from 'react';
import { Router } from '../../../common/types';
export declare const LayoutRootPrivateAppInfo: (props: {
    appReq: AppReq;
    applyOverrides?: (appInfo: App) => Promise<App>;
    children: React.ReactNode;
    router: Router;
}) => React.JSX.Element;
