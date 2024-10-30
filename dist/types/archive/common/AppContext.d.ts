import { AppInfo, NewAppInfoReq } from '@ongoku/app-lib/src/archive/common/App';
import React from 'react';
interface AppInfoContectValue {
    appInfo: AppInfo | null;
    loading: boolean;
}
export declare const AppInfoContext: React.Context<AppInfoContectValue>;
export declare const AppInfoProvider: (props: {
    newAppInfoReq: NewAppInfoReq;
    children?: React.ReactNode;
}) => React.JSX.Element;
export {};
