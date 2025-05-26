import { NavLink, Tooltip, Text, Group, Box } from "@mantine/core";
import { useApp } from "../../providers/index-client";
import { addBaseURL } from "../../utils";
import { FiExternalLink } from "react-icons/fi";
import { useAuth } from "../../providers/index-client";
import { useMakeRequest } from "../../utils/api/index-client";
import { ServerResponseWrapper } from "../components";
import React from "react";
export var AppNavBar = function (props) {
    // Get the app
    var _a = useApp(), ongokuApp = _a.ongokuApp, loading = _a.loading, error = _a.error;
    // Handle loading state
    if (loading) {
        return (React.createElement("div", { style: { padding: "16px", textAlign: "center" } },
            React.createElement(Text, null, "Loading application data...")));
    }
    // Handle error state
    if (error || !ongokuApp) {
        return (React.createElement("div", { style: { padding: "16px" } },
            React.createElement(Text, { color: "red" }, "Error loading application data"),
            React.createElement(Text, { size: "sm", color: "dimmed" }, (error === null || error === void 0 ? void 0 : error.message) || "App not initialized")));
    }
    return (React.createElement("div", { className: "h-full overflow-y-auto flex flex-col" },
        React.createElement("div", { className: "flex-grow" },
            React.createElement(NavLink, { key: "services", label: "Application" },
                React.createElement(NavLinksInnerForServices, { appInfo: ongokuApp, svcs: ongokuApp.services.filter(function (svc) { return svc.source !== "mod"; }) })),
            React.createElement(NavLink, { key: "services-builtin", label: "Built In" },
                React.createElement(NavLinksInnerForServices, { appInfo: ongokuApp, svcs: ongokuApp.services.filter(function (svc) { return svc.source === "mod"; }) })),
            React.createElement(NavLink, { key: "api-docs", target: "_blank", href: addBaseURL("/v2/docs"), label: React.createElement(React.Fragment, null,
                    "API Documentation",
                    " ",
                    React.createElement(FiExternalLink, null)) })),
        React.createElement(NavbarFooter, null)));
};
// Component for the Navbar footer with user and API status
var NavbarFooter = function () {
    var _a, _b, _c, _d, _e, _f;
    // Get the user from the session
    var user = useAuth().user;
    var apiStatusCall = useMakeRequest({
        relativePath: "/v1/info",
        method: "GET",
        data: {
            stub: "",
        },
    });
    return (React.createElement(Box, { className: "mt-auto border-t border-gray-200 p-3" },
        React.createElement(Group, { className: "mb-2 flex justify-between" },
            React.createElement(ServerResponseWrapper, { error: apiStatusCall.error || ((_a = apiStatusCall.resp) === null || _a === void 0 ? void 0 : _a.error), loading: apiStatusCall.loading },
                React.createElement(Text, { className: "text-xs text-gray-500" },
                    "ongoku v", (_c = (_b = apiStatusCall.resp) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 :
                    _c.ongokuInfo.semanticVersion,
                    " (", (_f = (_e = (_d = apiStatusCall.resp) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.ongokuInfo.gitCommitHash) === null || _f === void 0 ? void 0 :
                    _f.substring(0, 10),
                    ")")))));
};
var NavLinksInnerForServices = function (props) {
    var appInfo = props.appInfo, svcs = props.svcs;
    return (React.createElement(React.Fragment, null, svcs.map(function (svc) {
        return (React.createElement(NavLinksForService, { key: svc.getName().toRaw(), appInfo: appInfo, svc: svc }));
    })));
};
var NavLinksForService = function (props) {
    var appInfo = props.appInfo, svc = props.svc;
    var entities = appInfo.getServiceEntities(svc.namespace.toRaw());
    var methods = appInfo.getServiceMethods(svc.namespace.toRaw());
    if (methods.length > 0) {
        console.log("[NavLinksForService] svc", svc.getName().toRaw(), "methods", methods, "mthdToString", methods[0].namespace.toString(), "mthdToURLPath", methods[0].namespace.toURLPath());
    }
    var svcLabel = svc.description ? (React.createElement(Tooltip, { label: svc.description },
        React.createElement("span", null, svc.getNameFriendly()))) : (svc.getNameFriendly());
    return (React.createElement(NavLink, { key: svc.getName().toRaw(), href: "svc-".concat(svc.getName().toRaw()), label: svcLabel },
        (entities.length > 0 &&
            entities.map(function (ent) {
                return (React.createElement(NavLink, { key: ent.namespace.toString(), href: "".concat(ent.namespace.toURLPath(), "/list"), label: ent.getNameFriendly() }));
            })) || (React.createElement(NavLink, { key: svc.getName().toRaw() + "-entities-none", label: "No entities" })),
        React.createElement(NavLink, { key: svc.getName().toRaw() + "-methods", href: svc.getName().toRaw() + "-methods", label: "Methods" }, (methods.length > 0 &&
            methods.map(function (mth) {
                var _a, _b;
                return (React.createElement(NavLink, { key: mth.namespace.toString(), href: "/".concat((_a = mth.namespace.service) === null || _a === void 0 ? void 0 : _a.toRaw(), "/method/").concat((_b = mth.namespace.method) === null || _b === void 0 ? void 0 : _b.toRaw()), label: mth.namespace.toLabel() }));
            })) || (React.createElement(NavLink, { key: svc.getName().toRaw() + "-methods-none", label: "No methods" }, " ")))));
};
