'use client';
import { Anchor, AppShell, Burger, Group, Image, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppContext, AppProvider } from '../../../common/AppContextV3';
import { LogoutButton } from '../../mantine/module_user/LogoutButton';
import React, { Suspense, useContext } from 'react';
import { AppNavBar } from '../../mantine/AppNavBar';
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
                React.createElement(Suspense, null, props.children)))));
};
