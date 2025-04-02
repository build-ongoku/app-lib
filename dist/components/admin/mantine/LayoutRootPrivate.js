'use client';
import { useAuth } from '../../../common/AuthContext';
import { ScreenLoader } from './Loader';
import React, { useEffect, useState } from 'react';
// LayoutRootPrivate handles the authentication logic for the private part of the app.
export var LayoutRootPrivate = function (props) {
    var router = props.router;
    var _a = useState(true), processing = _a[0], setProcessing = _a[1];
    var _b = useAuth(), session = _b.session, loadingSession = _b.loading;
    console.log('[LayoutRootPrivate] Rendering...');
    // Do not allow unauthenticated users to access this part of the app.
    useEffect(function () {
        // Only run once session is loaded.
        if (loadingSession) {
            return;
        }
        console.log('[LayoutRootPrivate] [useEffect]: Session loaded, checking...', session);
        if (!session) {
            setProcessing(false);
            router.push('/login');
        }
        else {
            setProcessing(false);
        }
    }, [session, loadingSession]);
    if (loadingSession || processing || !session) {
        return React.createElement(ScreenLoader, null);
    }
    return React.createElement("div", null, props.children);
};
