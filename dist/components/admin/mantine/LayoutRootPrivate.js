import { useAuth } from '../../../common/AuthContext.js';
import { ScreenLoader } from './Loader.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default, { useState, useEffect } from 'react';

// LayoutRootPrivate handles the authentication logic for the private part of the app.
var LayoutRootPrivate = function (props) {
    var router = navigationExports.useRouter();
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
        return React__default.createElement(ScreenLoader, null);
    }
    return React__default.createElement("div", null, props.children);
};

export { LayoutRootPrivate };
