/* * * * * *
 * App Context
 * * * * * */
import { Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { App } from './app_v3';
export var AppContext = React.createContext({ appInfo: null });
AppContext.displayName = 'AppContext';
export var AppProvider = function (props) {
    var _app = new App(props.appReq);
    var _a = useState(_app), app = _a[0], setApp = _a[1];
    var _b = useState(true), processing = _b[0], setProcessing = _b[1];
    useEffect(function () {
        if (props.applyOverrides) {
            console.log('[AppProvider] Applying overrides...', 'appInfo', app);
            props
                .applyOverrides(app)
                .then(function (app) {
                setApp(app);
            })
                .catch(function (e) {
                var errMsg = '[AppProvider] Failed to apply entity overrides. There was an error.';
                console.error(errMsg, 'error', e);
                throw new Error(errMsg);
            });
            console.log('[AppProvider] Applied overrides!', 'appInfo', app);
        }
        if (processing) {
            setProcessing(false);
        }
    }, [props.appReq, props.applyOverrides]);
    if (processing) {
        return React.createElement(Loader, { size: "xl", type: "bars" });
    }
    console.log('[AppProvider] AppContext being created', 'appInfo', _app);
    return React.createElement(AppContext.Provider, { value: { appInfo: app } },
        " ",
        props.children);
};
