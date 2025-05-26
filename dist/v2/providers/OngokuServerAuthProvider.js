"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useOngokuServer } from './OngokuServerProvider';
import { useAuth } from './AuthProvider';
// Storage key for the Ongoku server token
var ONGOKU_TOKEN_STORAGE_KEY = 'ongoku_auth_token';
/**
 * Default Ongoku server auth state
 */
var defaultOngokuServerAuthState = {
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    authenticate: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('OngokuServerAuth not initialized');
        });
    }); }
};
/**
 * Create a context for the Ongoku server authentication
 */
export var OngokuServerAuthContext = createContext(defaultOngokuServerAuthState);
/**
 * Provider component for Ongoku server authentication
 * Handles authentication with the Ongoku server using a Kinde token
 */
export var OngokuServerAuthProvider = function (_a) {
    var children = _a.children;
    // Get server information
    var _b = useOngokuServer(), apiEndpoint = _b.apiEndpoint, isServerValid = _b.isValid;
    // Get authentication state from AuthProvider
    var _c = useAuth(), kindeToken = _c.authToken, isAuthProviderAuthenticated = _c.isAuthenticated, authSource = _c.authSource;
    // State for token management
    var _d = useState(null), token = _d[0], setTokenState = _d[1];
    var _e = useState(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    // Initialize token from localStorage on mount
    useEffect(function () {
        try {
            if (typeof window !== 'undefined') {
                var token_1 = localStorage.getItem(ONGOKU_TOKEN_STORAGE_KEY);
                if (token_1) {
                    setTokenState(token_1);
                    console.log('[OngokuServerAuth] Initialized token from localStorage');
                }
            }
        }
        catch (e) {
            console.error('[OngokuServerAuth] Failed to read token from localStorage', e);
        }
    }, []);
    // Wrapper for setToken that also updates localStorage
    var setToken = useCallback(function (newToken) {
        setTokenState(newToken);
        try {
            if (typeof window !== 'undefined') {
                if (newToken) {
                    // Store the token in localStorage
                    localStorage.setItem(ONGOKU_TOKEN_STORAGE_KEY, newToken);
                    console.log('[OngokuServerAuth] Token stored in localStorage');
                }
                else {
                    // Remove the token from localStorage
                    localStorage.removeItem(ONGOKU_TOKEN_STORAGE_KEY);
                    console.log('[OngokuServerAuth] Token removed from localStorage');
                }
            }
        }
        catch (e) {
            console.error('[OngokuServerAuth] Failed to update token in localStorage', e);
        }
    }, []);
    // Authentication function
    var authenticate = useCallback(function (tokenToUse) { return __awaiter(void 0, void 0, void 0, function () {
        var authUrl, response, errorText, responseData, ongokuToken, err_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isServerValid) {
                        throw new Error('OngokuServerAuthProvider: Server configuration is not valid');
                    }
                    if (!tokenToUse) {
                        throw new Error('OngokuServerAuthProvider: Kinde token is required');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    setIsLoading(true);
                    setError(null);
                    authUrl = "".concat(apiEndpoint, "/v1/auth/authenticate_token_kinde");
                    return [4 /*yield*/, fetch(authUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                token: tokenToUse
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorText = _a.sent();
                    throw new Error("Authentication failed: ".concat(response.status, " ").concat(errorText));
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    responseData = _a.sent();
                    // Check for API error
                    if (responseData.error) {
                        throw new Error("API Error: ".concat(responseData.error));
                    }
                    ongokuToken = (responseData.data || {}).token;
                    if (!ongokuToken) {
                        throw new Error('Authentication response did not include a token');
                    }
                    // Store the token in state and cookie
                    setToken(ongokuToken);
                    // Log success message
                    console.log('[OngokuServerAuthProvider] Successfully authenticated with Ongoku server');
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    error_1 = err_1 instanceof Error ? err_1 : new Error(String(err_1));
                    console.error('[OngokuServerAuthProvider] Authentication error:', error_1);
                    setError(error_1);
                    setToken(null);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [apiEndpoint, isServerValid]);
    // Track whether we've attempted authentication with the current token
    var _g = useState(false), hasAttemptedAuth = _g[0], setHasAttemptedAuth = _g[1];
    // Reset auth state when auth provider state changes
    useEffect(function () {
        // Reset our token if AuthProvider becomes unauthenticated
        if (!isAuthProviderAuthenticated) {
            setToken(null);
            setError(null);
            setHasAttemptedAuth(false); // Reset attempt tracking
            return;
        }
        // Validate auth source
        if (authSource !== 'kinde') {
            setError(new Error('OngokuServerAuthProvider requires authentication source to be kinde'));
            setToken(null);
            setHasAttemptedAuth(false); // Reset attempt tracking
            return;
        }
        // Reset attempt flag when token changes
        if (kindeToken) {
            setHasAttemptedAuth(false);
        }
    }, [isAuthProviderAuthenticated, authSource, kindeToken]);
    // Handle authentication attempts
    useEffect(function () {
        // Only proceed if conditions are right for authentication
        var shouldAuthenticate = isAuthProviderAuthenticated && // AuthProvider is authenticated
            authSource === 'kinde' && // Auth source is kinde
            kindeToken && // We have a token
            isServerValid && // Server config is valid
            !token && // We're not already authenticated
            !hasAttemptedAuth && // Haven't tried with this token yet
            !isLoading; // Not currently loading
        if (shouldAuthenticate) {
            setHasAttemptedAuth(true); // Mark that we've attempted with this token
            authenticate(kindeToken).catch(function (err) {
                console.error('[OngokuServerAuthProvider] Authentication failed:', err);
                // Error is already set in the authenticate function
            });
        }
    }, [kindeToken, authSource, isServerValid, token, isLoading, authenticate,
        isAuthProviderAuthenticated, hasAttemptedAuth]);
    // Create the context value
    var contextValue = {
        token: token,
        isLoading: isLoading,
        error: error,
        isAuthenticated: Boolean(token),
        authenticate: authenticate
    };
    // Provide context values to children
    return (React.createElement(OngokuServerAuthContext.Provider, { value: contextValue }, children));
};
/**
 * Custom hook to use the Ongoku server auth context
 * Use this to access authentication state and methods throughout the application
 */
export var useOngokuServerAuth = function () { return useContext(OngokuServerAuthContext); };
/**
 * Higher-order component that requires Ongoku server authentication
 * Wraps components that need access to authentication state
 */
export function withOngokuServerAuth(Component) {
    return function (props) {
        var auth = useOngokuServerAuth();
        if (auth.isLoading) {
            return React.createElement("div", null, "Authenticating with Ongoku server...");
        }
        if (auth.error) {
            return React.createElement("div", null,
                "Authentication error: ",
                auth.error.message);
        }
        if (!auth.isAuthenticated) {
            return React.createElement("div", null, "Not authenticated with Ongoku server");
        }
        return React.createElement(Component, __assign({}, props, { auth: auth }));
    };
}
