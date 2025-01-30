'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { joinURL } from '../providers/provider';
import { makeRequest } from '../providers/httpV2';
import React, { useContext, useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
export var getDetailsFromSession = function (session) {
    var decodedToken = decodeToken(session.token);
    if (!decodedToken) {
        throw new Error('Could not decode token. Invalid token.');
    }
    return decodedToken;
};
var _cookieKey = 'session';
export var getSessionCookie = function () {
    var sessionStr = localStorage.getItem(_cookieKey);
    if (!sessionStr) {
        return undefined;
    }
    return JSON.parse(sessionStr);
};
export var setSessionCookie = function (session) {
    var sessionStr = JSON.stringify(session);
    localStorage.setItem(_cookieKey, sessionStr);
};
export var deleteSessionCookie = function () {
    localStorage.removeItem(_cookieKey);
};
export var verifySessionCookie = function () { return __awaiter(void 0, void 0, void 0, function () {
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
export var verifyToken = function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, makeRequest({
                    relativePath: joinURL('v1', 'auth', 'authenticate_token'),
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
                return [2 /*return*/];
        }
    });
}); };
export var AuthContext = React.createContext(undefined);
AuthContext.displayName = 'AuthContext';
export var AuthProvider = function (props) {
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
    return React.createElement(AuthContext.Provider, { value: { session: session, authenticate: authenticate, endSession: endSession, loading: loading } }, props.children);
};
export var useAuth = function () {
    var context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
