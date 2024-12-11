'use client';
import { Anchor, AppShell, Burger, Group, Image, NavLink, Title, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppContext, AppProvider } from '../../../common/AppContextV3';
import { LogoutButton } from '../../mantine/module_user/LogoutButton';
import { addBaseURL } from '../../../providers/provider';
import React, { Suspense, useContext } from 'react';
import { FiExternalLink } from 'react-icons/fi';
export var LayoutRootPrivateAppInfo = function (props) {
    return (React.createElement(AppProvider, { appReq: props.appReq, applyOverrides: props.applyOverrides },
        React.createElement(AppLayout, null, props.children)));
};
var AppLayout = function (props) {
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
                React.createElement(LogoutButton, null))),
        React.createElement(AppShell.Navbar, null,
            React.createElement(NavLink, { key: 'services', label: 'Application' },
                React.createElement(NavLinksInnerForServices, { appInfo: appInfo, svcs: appInfo.services.filter(function (svc) { return svc.source !== 'mod'; }) })),
            React.createElement(NavLink, { key: 'services-builtin', label: 'Built In' },
                React.createElement(NavLinksInnerForServices, { appInfo: appInfo, svcs: appInfo.services.filter(function (svc) { return svc.source === 'mod'; }) })),
            React.createElement(NavLink, { key: 'api-docs', target: "_blank", href: addBaseURL('/v1/docs'), label: React.createElement(React.Fragment, null,
                    'API Documentation',
                    " ",
                    React.createElement(FiExternalLink, null)) })),
        React.createElement(AppShell.Main, null,
            React.createElement("div", { className: "p-10" },
                React.createElement(Suspense, null, props.children)))));
};
var NavLinksInnerForServices = function (props) {
    var appInfo = props.appInfo, svcs = props.svcs;
    return (React.createElement(React.Fragment, null, svcs.map(function (svc) {
        return React.createElement(NavLinksForService, { key: svc.getName().toRaw(), appInfo: appInfo, svc: svc });
    })));
};
var NavLinksForService = function (props) {
    var appInfo = props.appInfo, svc = props.svc;
    var entities = appInfo.getServiceEntities(svc.namespace.toRaw());
    var methods = appInfo.getServiceMethods(svc.namespace.toRaw());
    if (methods.length > 0) {
        console.log('[NavLinksForService] svc', svc.getName().toRaw(), 'methods', methods, 'mthdToString', methods[0].namespace.toString(), 'mthdToURLPath', methods[0].namespace.toURLPath());
    }
    var svcLabel = svc.description ? (React.createElement(Tooltip, { label: svc.description },
        React.createElement("span", null, svc.getNameFriendly()))) : (svc.getNameFriendly());
    return (React.createElement(NavLink, { key: svc.getName().toRaw(), href: "svc-".concat(svc.getName().toRaw()), label: svcLabel },
        (entities.length > 0 &&
            entities.map(function (ent) {
                return React.createElement(NavLink, { key: ent.namespace.toString(), href: "".concat(ent.namespace.toURLPath(), "/list"), label: ent.getNameFriendly() });
            })) || React.createElement(NavLink, { key: svc.getName().toRaw() + '-entities-none', label: 'No entities' }),
        React.createElement(NavLink, { key: svc.getName().toRaw() + '-methods', href: svc.getName().toRaw() + '-methods', label: 'Methods' }, (methods.length > 0 &&
            methods.map(function (mth) {
                var _a, _b;
                return React.createElement(NavLink, { key: mth.namespace.toString(), href: "/".concat((_a = mth.namespace.service) === null || _a === void 0 ? void 0 : _a.toRaw(), "/method/").concat((_b = mth.namespace.method) === null || _b === void 0 ? void 0 : _b.toRaw()), label: mth.namespace.toLabel() });
            })) || (React.createElement(NavLink, { key: svc.getName().toRaw() + '-methods-none', label: 'No methods' }, ' ')))));
};
