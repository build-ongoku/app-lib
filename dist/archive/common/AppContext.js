'use client';
import { AppInfo } from '@ongoku/app-lib/src/archive/common/App';
import React from 'react';
export var AppInfoContext = React.createContext({ appInfo: null, loading: true });
AppInfoContext.displayName = 'AppInfoContext';
export var AppInfoProvider = function (props) {
    var _a = React.useState(null), appInfo = _a[0], setAppInfo = _a[1];
    var _b = React.useState(true), loading = _b[0], setLoading = _b[1];
    React.useEffect(function () {
        console.log('Setting AppInfo');
        var _appInfo = new AppInfo(props.newAppInfoReq);
        setAppInfo(_appInfo);
        console.log('AppInfo:', _appInfo);
        setLoading(false);
    }, []);
    return React.createElement(AppInfoContext.Provider, { value: { appInfo: appInfo, loading: loading } },
        " ",
        props.children);
};
