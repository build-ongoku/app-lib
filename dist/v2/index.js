'use client';
// Main entry point for the library
// WARNING: Importing from this file in a server component will cause errors
// due to client-side code being included
export * from './core';
export * from './providers';
export * from './ui';
export * from './utils';
// Constants
export var VERSION = '0.1.0';
// Utility functions (safe in any context)
export var formatDate = function (date) {
    return date.toLocaleDateString();
};
export var generateId = function () {
    return Math.random().toString(36).substring(2, 9);
};
// App utility functions
export var getAppVersion = function (config) {
    return "v".concat(config.version);
};
export var getAppInfo = function (config) {
    return "".concat(config.name, " ").concat(getAppVersion(config)).concat(config.description ? ": ".concat(config.description) : '');
};
// This is a dummy function to simulate what would be a React component
export var createAppProvider = function (config) {
    return { appConfig: config };
};
// This type definition is now exported from './providers/AppProvider'
// So we don't need to redefine it here
// This is a dummy function to simulate what would be a React hook
export var useApp = function (provider) {
    return provider.appConfig;
};
