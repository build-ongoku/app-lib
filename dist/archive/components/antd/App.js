import { AppInfoContext, AppInfoProvider } from '@ongoku/app-lib/src/archive/common/AppContext';
import { AuthProvider, useAuth } from '@ongoku/app-lib/src/common/AuthContext';
import { ServiceInfoContext } from '@ongoku/app-lib/src/archive/common/ServiceContext';
import { DefaultAddView } from '@ongoku/app-lib/src/components/antd/default/Add';
import { DefaultDetailView } from '@ongoku/app-lib/src/components/antd/default/Detail';
import { DefaultEditView } from '@ongoku/app-lib/src/components/antd/default/Edit';
import { DefaultListView } from '@ongoku/app-lib/src/components/antd/default/List';
import { AppHeader } from '@ongoku/app-lib/src/components/antd/AppHeader';
import { LoginPage } from '@ongoku/app-lib/src/components/antd/Login/Login';
import { LogoutPage } from '@ongoku/app-lib/src/components/antd/Logout/Logout';
import { MenuWrapper } from '@ongoku/app-lib/src/components/antd/Menu';
import { RegisterPage } from '@ongoku/app-lib/src/components/antd/Register/Register';
import { Layout, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
// import { applyEntityInfoOverrides } from 'overrides/'
export var GokuApp = function () {
    return (React.createElement("div", { className: "App" },
        React.createElement(AppContexted, null)));
};
var AppContexted = function (props) {
    return (React.createElement(AuthProvider, null,
        React.createElement(AppComponent, null)));
};
var AppComponent = function () {
    // Load Auth Session from local storage, upon loading
    var useAuthResp = useAuth();
    if (useAuthResp.loading) {
        return React.createElement(Spin, { size: "large", spinning: true });
    }
    if (!useAuthResp.loading) {
        return React.createElement(Spin, { size: "large", spinning: true });
    }
    var Component = UnauthenticatedApp;
    if (useAuthResp.session) {
        Component = AuthenticatedApp;
    }
    return React.createElement(Component, null);
};
var UnauthenticatedApp = function () {
    console.log('Using unauthenticated app');
    return (React.createElement(BrowserRouter, { basename: "admin" },
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/login", element: React.createElement(LoginPage, null) }),
            React.createElement(Route, { path: "/register", element: React.createElement(RegisterPage, null) }),
            React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: "/login" }) }))));
};
var AuthenticatedApp = function (props) {
    // applyEntityInfoOverrides({ appInfo: appInfo })
    if (props === void 0) { props = {}; }
    var Header = Layout.Header, Content = Layout.Content, Footer = Layout.Footer, Sider = Layout.Sider;
    var _a = useState(false), siderCollapsed = _a[0], setSiderCollapsed = _a[1];
    return (React.createElement(AppInfoProvider, null,
        React.createElement(BrowserRouter, { basename: "admin" },
            React.createElement(Layout, { style: { minHeight: '100vh' } },
                React.createElement(Sider, { width: 250, collapsible: true, collapsed: siderCollapsed, onCollapse: function () { return setSiderCollapsed(!siderCollapsed); } },
                    React.createElement("div", { className: "logo", style: {
                            height: '32px',
                            margin: '16px',
                            background: 'rgba(255, 255, 255, 0.3)',
                        } }, "LOGO"),
                    React.createElement(MenuWrapper, null)),
                React.createElement(Layout, { className: "site-layout" },
                    React.createElement(Header, { className: "site-layout-background" },
                        React.createElement(AppHeader, null)),
                    React.createElement(Content, null,
                        React.createElement(Routes, null,
                            React.createElement(Route, { path: "/logout", element: React.createElement(LogoutPage, null) }),
                            React.createElement(Route, { path: "/:serviceName/*", element: React.createElement(ServiceRoutes, null) }),
                            React.createElement(Route, { path: "/", element: React.createElement(Home, null) }))),
                    React.createElement(Footer, { style: { textAlign: 'center' } }, "Made with \u2764 using goku"))))));
};
var ServiceRoutes = function (props) {
    var serviceName = useParams().serviceName;
    // Get Store from context
    var appInfo = useContext(AppInfoContext).appInfo;
    if (!appInfo || !serviceName) {
        return React.createElement(Spin, null);
    }
    var serviceInfo = appInfo.getServiceInfo(serviceName);
    console.log('ServiceRoutes: Service Name:', serviceInfo);
    if (!serviceInfo) {
        console.log("Routes: Service ".concat(serviceName, " not recognized"));
        return React.createElement(Navigate, { to: "/" });
    }
    return (React.createElement(ServiceInfoContext.Provider, { value: serviceInfo },
        React.createElement(Routes, null,
            React.createElement(Route, { path: '/:entityName/*', element: React.createElement(EntityRoutes, null) }))));
};
var EntityRoutes = function (props) {
    var entityName = useParams().entityName;
    var _a = useState(), entityInfo = _a[0], setEntityInfo = _a[1];
    // Get Store from context
    var serviceInfo = useContext(ServiceInfoContext);
    if (!serviceInfo || !entityName) {
        return React.createElement(Spin, null);
    }
    console.log('EntityRoutes: Entity Name:', entityName);
    useEffect(function () {
        var entityInfoL = serviceInfo.getEntityInfo(entityName);
        if (entityInfoL) {
            setEntityInfo(entityInfoL);
        }
    }, [entityName]);
    if (!entityInfo) {
        return React.createElement(Spin, null);
    }
    return (React.createElement(Routes, null,
        React.createElement(Route, { path: '/add', element: React.createElement(DefaultAddView, { entityInfo: entityInfo }) }),
        React.createElement(Route, { path: '/list', element: React.createElement(DefaultListView, { entityInfo: entityInfo }) }),
        React.createElement(Route, { path: '/:id/*', element: React.createElement(EntityInstanceRoutes, { entityInfo: entityInfo, serviceInfo: serviceInfo }) })));
};
// EntityInstanceRoutes are routes associated with a particular instance of an entity
var EntityInstanceRoutes = function (props) {
    var entityInfo = props.entityInfo, serviceInfo = props.serviceInfo;
    var id = useParams().id;
    if (!serviceInfo || !entityInfo || !id) {
        return React.createElement(Spin, null);
    }
    return (React.createElement(Routes, null,
        React.createElement(Route, { path: "/edit", element: React.createElement(DefaultEditView, { entityInfo: entityInfo, objectId: id }) }),
        React.createElement(Route, { path: "", element: React.createElement(DefaultDetailView, { entityInfo: entityInfo, objectId: id }) })));
};
var Home = function () {
    return (React.createElement("header", { className: "App-header" },
        React.createElement("p", null,
            "Edit ",
            React.createElement("code", null, "src/App.tsx"),
            " and save to reload."),
        React.createElement("a", { className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, "Learn React")));
};
