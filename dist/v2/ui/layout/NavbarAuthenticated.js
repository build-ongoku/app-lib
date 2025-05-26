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
import React, { useEffect, useState } from 'react';
import { NavLink, ScrollArea, Text, Box, Stack, Collapse, rem } from '@mantine/core';
import { MdDashboard, MdExpandMore, MdExpandLess, MdHome, MdApps, MdFolder, MdSettings } from 'react-icons/md';
import { SafeMantineProvider, useApp, useUIFramework } from '../../index-client';
export function NavbarAuthenticated(_a) {
    var onLinkClick = _a.onLinkClick;
    var _b = useUIFramework(), LinkComponent = _b.LinkComponent, _c = _b.pathname, pathname = _c === void 0 ? '' : _c;
    var ongokuApp = useApp().ongokuApp;
    var _d = useState(null), activeSection = _d[0], setActiveSection = _d[1];
    var _e = useState([]), serviceLinks = _e[0], setServiceLinks = _e[1];
    useEffect(function () {
        // Extract a section from pathname if it's part of a section
        if (pathname && pathname.startsWith('/svc/')) {
            var parts = pathname.split('/');
            if (parts.length >= 3) {
                setActiveSection('services');
            }
        }
        // Load services if ongokuApp is available
        if (ongokuApp) {
            // In a real app, you'd get a list of services from the app
            // For now we'll just hardcode some examples
            setServiceLinks([
                { slug: 'cms', name: 'Content Management' },
                { slug: 'auth', name: 'Authentication' },
                { slug: 'analytics', name: 'Analytics' }
            ]);
        }
    }, [pathname, ongokuApp]);
    var toggleSection = function (section) {
        setActiveSection(function (prev) { return prev === section ? null : section; });
    };
    var iconProps = { style: { width: rem(20), height: rem(20) } };
    return (React.createElement(SafeMantineProvider, null,
        React.createElement(Box, null,
            React.createElement(Text, { size: "sm", fw: 500, mb: "md" }, "Main Navigation"),
            React.createElement(ScrollArea, { scrollbarSize: 6, h: "calc(100vh - 140px)" },
                React.createElement(Stack, { gap: "xs" },
                    React.createElement(NavLink, { label: "Dashboard", leftSection: React.createElement(MdDashboard, __assign({}, iconProps)), active: pathname === '/dashboard', component: LinkComponent, href: "/dashboard", onClick: onLinkClick }),
                    React.createElement(NavLink, { label: "Home", leftSection: React.createElement(MdHome, __assign({}, iconProps)), active: pathname === '/', component: LinkComponent, href: "/", onClick: onLinkClick }),
                    React.createElement(NavLink, { label: "Services", leftSection: React.createElement(MdApps, __assign({}, iconProps)), rightSection: activeSection === 'services'
                            ? React.createElement(MdExpandLess, __assign({}, iconProps))
                            : React.createElement(MdExpandMore, __assign({}, iconProps)), onClick: function () { return toggleSection('services'); }, active: pathname.includes('/svc/') }),
                    React.createElement(Collapse, { in: activeSection === 'services' },
                        React.createElement(Stack, { gap: 0, ml: "md", pl: "xs" }, serviceLinks.map(function (service) { return (React.createElement(NavLink, { key: service.slug, label: service.name, leftSection: React.createElement(MdFolder, __assign({}, iconProps)), active: pathname.includes("/svc/".concat(service.slug, "/")), component: LinkComponent, href: "/svc/".concat(service.slug), onClick: onLinkClick })); }))),
                    React.createElement(NavLink, { label: "Settings", leftSection: React.createElement(MdSettings, __assign({}, iconProps)), active: pathname === '/settings', component: LinkComponent, href: "/settings", onClick: onLinkClick }))))));
}
