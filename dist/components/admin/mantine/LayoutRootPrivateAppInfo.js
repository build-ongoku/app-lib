'use client';
import { Anchor, AppShell, Burger, Group, Image, Title, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppContext, AppProvider } from '../../../common/AppContextV3';
import { LogoutButton } from '../../mantine/module_user/LogoutButton';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { AppNavBar } from '../../mantine/AppNavBar';
import { IconInfoCircle, IconAlertCircle, IconExclamationCircle } from '@tabler/icons-react';
export var LayoutRootPrivateAppInfo = function (props) {
    return (React.createElement(AppProvider, { appReq: props.appReq, applyOverrides: props.applyOverrides },
        React.createElement(AppLayout, { router: props.router }, props.children)));
};
var AppLayout = function (props) {
    var router = props.router;
    var _a = useDisclosure(), opened = _a[0], toggle = _a[1].toggle;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('Unexpected: AppInfo not found');
    }
    console.log('[AppLayout] AppInfo fetched', 'appInfo', appInfo);
    return (React.createElement(AppShell, { header: { height: { base: 60, md: 70, lg: 80 } }, navbar: {
            width: { base: 200, md: 200, lg: 250 },
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
        }, padding: "md" },
        React.createElement(AppShell.Header, null,
            React.createElement(Group, { h: "100%", px: "md" },
                React.createElement(Burger, { className: "", opened: opened, onClick: toggle, hiddenFrom: "sm", size: "sm" }),
                React.createElement("div", { className: "" },
                    React.createElement(Anchor, { href: "/home", underline: "never", className: "" },
                        React.createElement(Image, { className: "", src: "/logo_1.png", alt: "OnGoku Logo", w: "auto", fit: "contain", height: 50 }))),
                React.createElement("div", { className: "" },
                    React.createElement(Anchor, { href: "/home", underline: "never", className: "" },
                        React.createElement(Title, { className: "", order: 2 },
                            ' ',
                            React.createElement("span", { className: "font-normal" }, "on"),
                            "goku",
                            ' '))),
                React.createElement("div", { className: "flex-grow" }),
                React.createElement(LogoutButton, { router: router }))),
        React.createElement(AppShell.Navbar, null,
            React.createElement(AppNavBar, null)),
        React.createElement(AppShell.Main, null,
            React.createElement("div", { className: "p-10" },
                React.createElement(AlertSection, { router: router }),
                React.createElement(Suspense, null, props.children)))));
};
// Alert component that reads URL parameters and displays alert messages
var AlertSection = function (_a) {
    var router = _a.router;
    var _b = useState([]), alerts = _b[0], setAlerts = _b[1];
    useEffect(function () {
        try {
            // Parse URL parameters to get alerts information
            var urlParams = new URLSearchParams(window.location.search);
            var alertsParam = urlParams.get('alerts');
            // Clear any existing alerts
            setAlerts([]);
            // If alerts parameter exists, parse it and set the alerts
            if (alertsParam) {
                // Parse the JSON array from the URL parameter
                var parsedAlerts = [];
                try {
                    parsedAlerts = JSON.parse(decodeURIComponent(alertsParam));
                    // Validate the structure of the parsed alerts
                    if (!Array.isArray(parsedAlerts)) {
                        console.error('Invalid alerts format: not an array');
                        return;
                    }
                }
                catch (e) {
                    console.error('Failed to parse alerts JSON', e);
                    return;
                }
                // Process each alert in the array
                var validAlerts = parsedAlerts
                    .filter(function (alert) { return alert && typeof alert === 'object' && 'type' in alert && 'message' in alert && typeof alert.message === 'string'; })
                    .map(function (alert) {
                    // Validate alert type
                    var validType = ['info', 'warning', 'error'].includes(alert.type) ? alert.type : 'info';
                    return {
                        type: validType,
                        message: alert.message,
                    };
                });
                setAlerts(validAlerts);
                // Clear the URL parameter after reading it
                if (router.push) {
                    var url = new URL(window.location.href);
                    url.searchParams.delete('alerts');
                    router.push(url.pathname + url.search);
                }
            }
        }
        catch (error) {
            console.error('Error processing alerts from URL', error);
        }
    }, [router]);
    // If no alerts, return null
    if (alerts.length === 0) {
        return null;
    }
    // Select icon based on alert type
    var iconMap = {
        info: React.createElement(IconInfoCircle, { size: "1.1rem" }),
        warning: React.createElement(IconExclamationCircle, { size: "1.1rem" }),
        error: React.createElement(IconAlertCircle, { size: "1.1rem" }),
    };
    // Select color based on alert type
    var colorMap = {
        info: 'blue',
        warning: 'yellow',
        error: 'red',
    };
    // Function to remove a specific alert by index
    var removeAlert = function (index) {
        setAlerts(function (currentAlerts) { return currentAlerts.filter(function (_, i) { return i !== index; }); });
    };
    return (React.createElement("div", { className: "space-y-2 mb-4" }, alerts.map(function (alert, index) { return (React.createElement(Alert, { key: index, icon: iconMap[alert.type], title: alert.type.charAt(0).toUpperCase() + alert.type.slice(1), color: colorMap[alert.type], withCloseButton: true, onClose: function () { return removeAlert(index); } }, alert.message)); })));
};
