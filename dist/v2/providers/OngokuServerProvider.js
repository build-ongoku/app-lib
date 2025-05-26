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
import React, { createContext, useContext } from "react";
/**
 * Default Ongoku server state
 */
var defaultOngokuServerState = {
    apiEndpoint: "",
    appName: "",
    isValid: false
};
/**
 * Create a context for the Ongoku server
 */
export var OngokuServerContext = createContext(defaultOngokuServerState);
/**
 * Provider component for Ongoku server context
 * Provides server configuration information to the application
 */
export var OngokuServerProvider = function (_a) {
    var apiEndpoint = _a.apiEndpoint, appName = _a.appName, children = _a.children;
    // Validate API endpoint
    if (!apiEndpoint || apiEndpoint.trim() === '') {
        throw new Error('OngokuServerProvider: apiEndpoint is required and cannot be empty');
    }
    // Validate app name
    if (!appName || appName.trim() === '') {
        throw new Error('OngokuServerProvider: appName is required and cannot be empty');
    }
    // At this point, all validation has passed
    var isValid = true;
    // Create the context value
    var contextValue = {
        apiEndpoint: apiEndpoint,
        appName: appName,
        isValid: isValid
    };
    // Provide context values to children
    return (React.createElement(OngokuServerContext.Provider, { value: contextValue }, children));
};
/**
 * Custom hook to use the Ongoku server context
 * Use this to access server information throughout the application
 */
export var useOngokuServer = function () { return useContext(OngokuServerContext); };
/**
 * Higher-order component that requires Ongoku server information
 * Wraps components that need access to server configuration
 */
export function withOngokuServer(Component) {
    return function (props) {
        var serverInfo = useOngokuServer();
        if (!serverInfo.isValid) {
            return React.createElement("div", null, "Ongoku server configuration is not valid");
        }
        return React.createElement(Component, __assign({}, props, { serverInfo: serverInfo }));
    };
}
// Helper function to get the app name from env variables
export var getAppNameHelper = function () {
    // Default
    var appName = process.env.GOKU_APP_NAME;
    if (!appName) { // Next.js
        appName = process.env.NEXT_PUBLIC_GOKU_APP_NAME;
    }
    if (!appName) { // Expo
        appName = process.env.EXPO_PUBLIC_GOKU_APP_NAME;
    }
    if (!appName) { // Default
        // Throw error
        throw new Error('OngokuServerProvider: App name not set. Please set the GOKU_APP_NAME (or equivalent e.g. NEXT_PUBLIC_GOKU_APP_NAME or EXPO_PUBLIC_GOKU_APP_NAME) environment variable.');
    }
    return appName;
};
// Helper function to construct the API base endpoint from env variables
export var constructAPIBaseURLHelper = function (params) {
    var _a;
    var _b = params || {}, protocol = _b.protocol, host = _b.host, port = _b.port;
    // Host
    if (!host) { // Default env variable
        host = process.env.GOKU_BACKEND_HOST;
    }
    if (!host) { // Next.js
        host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST;
    }
    if (!host) { // Expo
        host = process.env.EXPO_PUBLIC_GOKU_BACKEND_HOST;
    }
    // Note: add any other specific environment variables name for the host here
    // Default
    if (!host) {
        console.warn('[OngokuServerProvider] [constructAPIBaseURL] Host not set. Defaulting to localhost');
        host = 'localhost';
    }
    // Protocol
    if (!protocol) { // Default env variable
        protocol = process.env.GOKU_BACKEND_PROTOCOL;
    }
    if (!protocol) { // Next.js
        protocol = process.env.NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL;
    }
    if (!protocol) { // Expo
        protocol = process.env.EXPO_PUBLIC_GOKU_BACKEND_PROTOCOL;
    }
    if (!protocol) { // Use current window protocol
        protocol = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.protocol;
        if (protocol) {
            console.log('[OngokuServerProvider] [constructAPIBaseURL] Setting protocol to window.location.protocol', protocol);
        }
    }
    if (!protocol) { // Default to https
        protocol = 'https:';
        console.warn('[OngokuServerProvider] [constructAPIBaseURL] Protocol not set. Defaulting to https.');
    }
    // Ensure protocol is valid
    if (protocol === 'http' || protocol === 'https') {
        protocol = protocol + ':';
    }
    // Port
    if (!port) { // Default env variable
        port = process.env.GOKU_BACKEND_PORT;
    }
    if (!port) { // Next.js
        port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT;
    }
    if (!port) { // Expo
        port = process.env.EXPO_PUBLIC_GOKU_BACKEND_PORT;
    }
    if (!port) {
        console.warn('[OngokuServerProvider] [constructAPIBaseURL] Port not set. Leaving empty.');
    }
    var url = "".concat(protocol, "//").concat(host) + (port ? ":".concat(port) : '') + '/api';
    console.log('[OngokuServerProvider] [constructAPIBaseURL]', 'url: ', url);
    return url;
};
