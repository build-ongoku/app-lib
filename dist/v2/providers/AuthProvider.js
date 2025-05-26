"use client";
import React, { createContext, useContext } from "react";
// Default auth state when not authenticated
var defaultAuthContext = {
    isAuthenticated: false,
    isLoading: false,
    authSource: 'other'
};
// Create the context
export var AuthContext = createContext(defaultAuthContext);
/**
 * Hook to access authentication state
 */
export var useAuth = function () {
    return useContext(AuthContext);
};
/**
 * Provider component for auth context
 * Wraps the application to provide authentication state
 */
export var AuthProvider = function (_a) {
    var children = _a.children, authState = _a.authState;
    return (React.createElement(AuthContext.Provider, { value: authState }, children));
};
