import { NavLink, Tooltip, Text, Group, Avatar, Box } from '@mantine/core';
import * as React from 'react';
import { AppContext } from '../../common/AppContextV3';
import { useContext } from 'react';
import { addBaseURL } from '../../providers/provider';
import { FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../common/AuthContext';
import { useGetEntity, useMakeRequest } from '../../providers/httpV2';
import { ServerResponseWrapper } from './ServerResponseWrapper';
export var AppNavBar = function () {
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('Unexpected: AppInfo not found');
    }
    return (React.createElement("div", { className: "h-full overflow-y-auto flex flex-col" },
        React.createElement("div", { className: "flex-grow" },
            React.createElement(NavLink, { key: 'services', label: 'Application' },
                React.createElement(NavLinksInnerForServices, { appInfo: appInfo, svcs: appInfo.services.filter(function (svc) { return svc.source !== 'mod'; }) })),
            React.createElement(NavLink, { key: 'services-builtin', label: 'Built In' },
                React.createElement(NavLinksInnerForServices, { appInfo: appInfo, svcs: appInfo.services.filter(function (svc) { return svc.source === 'mod'; }) })),
            React.createElement(NavLink, { key: 'api-docs', target: "_blank", href: addBaseURL('/v2/docs'), label: React.createElement(React.Fragment, null,
                    'API Documentation',
                    " ",
                    React.createElement(FiExternalLink, null)) })),
        React.createElement(NavbarFooter, null)));
};
// Component for the Navbar footer with user and API status
var NavbarFooter = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    // Get the user from the session
    var session = useAuth().session;
    var getUserCall = useGetEntity({
        entityNamespace: { service: 'user', entity: 'user' },
        data: {
            id: (_a = session === null || session === void 0 ? void 0 : session.userID) !== null && _a !== void 0 ? _a : '',
        },
        skipFetchAtInit: (session === null || session === void 0 ? void 0 : session.userID) ? false : true,
    });
    var apiStatusCall = useMakeRequest({
        relativePath: '/v1/info',
        method: 'GET',
        data: {
            stub: '',
        },
    });
    return (React.createElement(Box, { className: "mt-auto border-t border-gray-200 p-3" },
        React.createElement(Group, null,
            React.createElement(ServerResponseWrapper, { error: getUserCall.error || ((_b = getUserCall.resp) === null || _b === void 0 ? void 0 : _b.error), loading: getUserCall.loading }, ((_c = getUserCall.resp) === null || _c === void 0 ? void 0 : _c.data) && (React.createElement(React.Fragment, null,
                React.createElement(Avatar, { radius: "xl", color: "blue" }, (_d = getUserCall.resp) === null || _d === void 0 ? void 0 : _d.data.name.firstName.charAt(0)),
                React.createElement("div", { className: "ml-2" },
                    React.createElement(Text, { className: "text-sm" }, (_e = getUserCall.resp) === null || _e === void 0 ? void 0 :
                        _e.data.name.firstName,
                        " ", (_f = getUserCall.resp) === null || _f === void 0 ? void 0 :
                        _f.data.name.lastName),
                    React.createElement(Text, { className: "text-xs text-gray-500" }, (_g = getUserCall.resp) === null || _g === void 0 ? void 0 : _g.data.email)))))),
        React.createElement("hr", { className: "h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" }),
        React.createElement(Group, { className: "mb-2 flex justify-between" },
            React.createElement(ServerResponseWrapper, { error: apiStatusCall.error || ((_h = apiStatusCall.resp) === null || _h === void 0 ? void 0 : _h.error), loading: apiStatusCall.loading },
                React.createElement(Text, { className: "text-sm text-gray-500" },
                    "ongoku v", (_k = (_j = apiStatusCall.resp) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 :
                    _k.ongokuInfo.semanticVersion,
                    " (", (_o = (_m = (_l = apiStatusCall.resp) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.ongokuInfo.gitCommitHash) === null || _o === void 0 ? void 0 :
                    _o.substring(0, 10),
                    ")")))));
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
