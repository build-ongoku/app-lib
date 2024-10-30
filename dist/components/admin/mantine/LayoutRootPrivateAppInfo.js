import { AppProvider, AppContext } from '../../../common/AppContextV3.js';
import { LogoutButton } from '../../mantine/module_user/LogoutButton.js';
import { joinURL } from '../../../providers/provider.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default, { useContext, Suspense } from 'react';
import { useDisclosure } from '../../../node_modules/@mantine/hooks/esm/use-disclosure/use-disclosure.js';
import { AppShell } from '../../../node_modules/@mantine/core/esm/components/AppShell/AppShell.js';
import { Group } from '../../../node_modules/@mantine/core/esm/components/Group/Group.js';
import { Burger } from '../../../node_modules/@mantine/core/esm/components/Burger/Burger.js';
import { Anchor } from '../../../node_modules/@mantine/core/esm/components/Anchor/Anchor.js';
import { Image } from '../../../node_modules/@mantine/core/esm/components/Image/Image.js';
import { Title } from '../../../node_modules/@mantine/core/esm/components/Title/Title.js';
import { NavLink } from '../../../node_modules/@mantine/core/esm/components/NavLink/NavLink.js';

var LayoutRootPrivateAppInfo = function (props) {
    return (React__default.createElement(AppProvider, { appReq: props.appReq, applyOverrides: props.applyOverrides },
        React__default.createElement(AppLayout, null, props.children)));
};
var AppLayout = function (props) {
    navigationExports.useRouter();
    var _a = useDisclosure(), opened = _a[0], toggle = _a[1].toggle;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('Unexpected: AppInfo not found');
    }
    console.log('[AppLayout] AppInfo fetched', 'appInfo', appInfo);
    return (React__default.createElement(AppShell, { header: { height: { base: 60, md: 70, lg: 80 } }, navbar: {
            width: { base: 200, md: 200, lg: 250 },
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
        }, padding: "md" },
        React__default.createElement(AppShell.Header, null,
            React__default.createElement(Group, { h: "100%", px: "md" },
                React__default.createElement(Burger, { className: "", opened: opened, onClick: toggle, hiddenFrom: "sm", size: "sm" }),
                React__default.createElement("div", { className: "" },
                    React__default.createElement(Anchor, { href: "/home", underline: "never", className: "" },
                        React__default.createElement(Image, { className: "", src: "/logo_1.png", alt: "OnGoku Logo", w: "auto", fit: "contain", height: 50 }))),
                React__default.createElement("div", { className: "" },
                    React__default.createElement(Anchor, { href: "/home", underline: "never", className: "" },
                        React__default.createElement(Title, { className: "", order: 2 },
                            ' ',
                            React__default.createElement("span", { className: "font-normal" }, "on"),
                            "goku",
                            ' '))),
                React__default.createElement("div", { className: "flex-grow" }),
                React__default.createElement(LogoutButton, null))),
        React__default.createElement(AppShell.Navbar, null,
            React__default.createElement(React__default.Fragment, null, appInfo.services.map(function (svc) {
                var entities = appInfo.getServiceEntities(svc.namespace.toRaw());
                // If service has no entities, don't show it in the navbar
                if (!entities || entities.length === 0) {
                    return null;
                }
                return (React__default.createElement(NavLink, { key: svc.getName().toRaw(), href: "svc-".concat(svc.getName().toRaw()), label: svc.getNameFriendly() }, entities.map(function (ent) {
                    return React__default.createElement(NavLink, { key: ent.namespace.toString(), href: "".concat(ent.namespace.toURLPath(), "/list"), label: ent.getNameFriendly() });
                })));
            })),
            React__default.createElement(NavLink, { key: 'methods', href: "methods", label: 'Methods' }, appInfo.methods.map(function (mth) {
                if (!mth.namespace.entity) {
                    // Do not show entity methods for now
                    return (React__default.createElement(NavLink, { key: mth.namespace.toString(), href: joinURL(mth.namespace.service.toSnake(), 'method', mth.namespace.method.toSnake()), label: mth.namespace.toLabel() }));
                }
            }))),
        React__default.createElement(AppShell.Main, null,
            React__default.createElement("div", { className: "p-10" },
                React__default.createElement(Suspense, null, props.children)))));
};

export { LayoutRootPrivateAppInfo };
