import { __awaiter, __generator } from '../_virtual/_tslib.js';
import { makeRequest } from '../providers/provider.js';
import React__default, { useState, useEffect, useContext } from 'react';

var _cookieKey = 'session';
var getSessionCookie = function () {
    var sessionStr = localStorage.getItem(_cookieKey);
    if (!sessionStr) {
        return undefined;
    }
    return JSON.parse(sessionStr);
};
var setSessionCookie = function (session) {
    var sessionStr = JSON.stringify(session);
    localStorage.setItem(_cookieKey, sessionStr);
};
var deleteSessionCookie = function () {
    localStorage.removeItem(_cookieKey);
};
var verifySessionCookie = function () { return __awaiter(void 0, void 0, void 0, function () {
    var session, ok;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                session = getSessionCookie();
                if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 2];
                return [4 /*yield*/, verifyToken({ token: session.token })];
            case 1:
                ok = _a.sent();
                if (!ok) {
                    deleteSessionCookie();
                }
                return [2 /*return*/, ok];
            case 2: return [2 /*return*/, false];
        }
    });
}); };
var verifyToken = function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, makeRequest({
                    path: 'v1/auth/authenticate_token',
                    method: 'POST',
                    data: {
                        token: props.token,
                    },
                })];
            case 1:
                response = _b.sent();
                if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.token) {
                    // Token is valid
                    return [2 /*return*/, true];
                }
                else {
                    return [2 /*return*/, false];
                }
        }
    });
}); };
var AuthContext = React__default.createContext(undefined);
AuthContext.displayName = 'AuthContext';
var AuthProvider = function (props) {
    var _a = useState(), session = _a[0], setSession = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var stable = 1;
    // Load from cookie
    useEffect(function () {
        console.debug('[AuthContext] [useEffect] Loading cookie from session...');
        if (!loading) {
            setLoading(true);
        }
        var sessionCookie = getSessionCookie();
        if (sessionCookie) {
            console.log('[AuthContext] [useEffect A] Setting session from cookie...', sessionCookie);
            setSession(sessionCookie);
        }
        setLoading(false);
    }, [stable]);
    // Verify token
    useEffect(function () {
        if (session === null || session === void 0 ? void 0 : session.token) {
            console.debug('[AuthContext] [useEffect B] Verifying session...', session);
            if (!loading) {
                setLoading(true);
            }
            verifyToken({ token: session.token }).then(function (ok) {
                if (!ok) {
                    setSession(undefined);
                    deleteSessionCookie();
                }
            });
            setLoading(false);
        }
    }, [session]);
    var authenticate = function (token) { return __awaiter(void 0, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[AuthContext] [authenticate] Authenticating token...', token);
                    return [4 /*yield*/, verifyToken({ token: token })];
                case 1:
                    ok = _a.sent();
                    if (ok) {
                        setSessionCookie({ token: token });
                        setSession({ token: token });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var endSession = function () {
        setSession(undefined);
        deleteSessionCookie();
    };
    return React__default.createElement(AuthContext.Provider, { value: { session: session, authenticate: authenticate, endSession: endSession, loading: loading } }, props.children);
};
var useAuth = function () {
    var context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext, AuthProvider, deleteSessionCookie, getSessionCookie, setSessionCookie, useAuth, verifySessionCookie, verifyToken };
