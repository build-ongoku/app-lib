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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import React, { createContext, useEffect, useContext, useState, useCallback } from 'react';
import { OngokuApp } from '../core/app';
import { useAuth } from './AuthProvider';
/**
 * Default app context state
 */
var defaultAppContextState = {
    ongokuApp: null,
    loading: false,
    error: null
};
/**
 * Create a context for the app
 */
export var AppContext = createContext(defaultAppContextState);
/**
 * Framework-agnostic app provider component
 */
export var AppProvider = function (_a) {
    var appReq = _a.appReq, _b = _a.apiEndpoint, apiEndpoint = _b === void 0 ? "https://api.ongoku.com" : _b, authToken = _a.authToken, children = _a.children, applyOverrides = _a.applyOverrides;
    // State for the app
    var _c = useState(null), app = _c[0], setApp = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    // Memoize the initialization function to maintain stable reference
    var initializeApp = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var config, currentApp, e_1, errMsg, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // If already initializing, don't start again
                    if (loading)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    // Mark as loading
                    setLoading(true);
                    config = {
                        apiEndpoint: apiEndpoint,
                        authToken: authToken
                    };
                    currentApp = new OngokuApp(appReq, config);
                    if (!applyOverrides) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, applyOverrides(currentApp)];
                case 3:
                    currentApp = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    errMsg = '[AppProvider] Failed to apply overrides';
                    console.error(errMsg, e_1);
                    throw e_1;
                case 5:
                    // Set app as initialized
                    currentApp.setInitialized(true);
                    // Update state
                    setApp(currentApp);
                    setError(null);
                    return [3 /*break*/, 8];
                case 6:
                    e_2 = _a.sent();
                    console.error('[AppProvider] Initialization error:', e_2);
                    setApp(null);
                    setError(e_2 instanceof Error ? e_2 : new Error(String(e_2)));
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [appReq, apiEndpoint, authToken, applyOverrides, loading]);
    // Initialize app on mount
    useEffect(function () {
        initializeApp();
    }, [initializeApp]);
    // Create the context value
    var contextValue = {
        ongokuApp: app,
        loading: loading,
        error: error
    };
    // Provide context values to children
    return (React.createElement(AppContext.Provider, { value: contextValue }, children));
};
/**
 * Custom hook to use the app context
 */
export var useApp = function () { return useContext(AppContext); };
/**
 * Higher-order component that requires Ongoku app access
 */
export function withApp(Component) {
    return function (props) {
        var _a = useApp(), ongokuApp = _a.ongokuApp, loading = _a.loading, error = _a.error;
        var isAuthenticated = useAuth().isAuthenticated;
        if (!isAuthenticated) {
            return React.createElement("div", null, "Please log in to access this content");
        }
        if (loading) {
            return React.createElement("div", null, "Loading app...");
        }
        if (error) {
            return React.createElement("div", null,
                "Error loading app: ",
                error.message);
        }
        if (!ongokuApp) {
            return React.createElement("div", null, "App not initialized");
        }
        return React.createElement(Component, __assign({}, props, { ongokuApp: ongokuApp }));
    };
}
