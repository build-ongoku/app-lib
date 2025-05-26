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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { createContext, useContext } from "react";
// Default value when context is not provided
var defaultContext = {
    // Default to plain anchor tags when no context is provided
    LinkComponent: function (_a) {
        var href = _a.href, children = _a.children, props = __rest(_a, ["href", "children"]);
        return (React.createElement("a", __assign({ href: href }, props), children));
    },
    router: {
        push: function (url) {
            console.log('Pushing to:', url);
        },
        replace: function (url) {
            console.log('Replasing to:', url);
        },
        back: function () {
            console.log('Going back');
        },
    },
};
export var UIFrameworkContext = createContext(defaultContext);
/**
 * Hook to access framework components and utilities
 */
export var useUIFramework = function () { return useContext(UIFrameworkContext); };
// Convenience hook that only returns the LinkComponent (for backward compatibility)
export var useLink = function () {
    var LinkComponent = useContext(UIFrameworkContext).LinkComponent;
    return { LinkComponent: LinkComponent };
};
export var UIFrameworkProvider = function (_a) {
    var children = _a.children, linkComponent = _a.linkComponent, router = _a.router, pathname = _a.pathname, notifications = _a.notifications, modals = _a.modals;
    return (React.createElement(UIFrameworkContext.Provider, { value: {
            LinkComponent: linkComponent,
            router: router,
            pathname: pathname,
            notifications: notifications,
            modals: modals
        } }, children));
};
// Export the original LinkProvider for backward compatibility
export var LinkProvider = UIFrameworkProvider;
