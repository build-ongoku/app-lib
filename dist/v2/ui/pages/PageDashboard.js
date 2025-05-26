"use client";
import React from "react";
import { Card, Title, Text, Container, Button, Stack } from "@mantine/core";
import { useApp, useAuth } from "../../providers/index-client";
import { SafeMantineProvider } from "../../providers/SafeMantineProvider";
export var PageDashboard = function (props) {
    var LoginLink = props.LoginLink;
    // Get auth state from AuthProvider
    var isAuthenticated = useAuth().isAuthenticated;
    // Get app state from AppProvider
    var _a = useApp(), ongokuApp = _a.ongokuApp, loading = _a.loading, error = _a.error;
    // Not authenticated state
    if (!isAuthenticated) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { size: "sm", className: "py-20" },
                React.createElement(Card, { withBorder: true, shadow: "sm", p: "xl" },
                    React.createElement(Stack, { align: "center", gap: "md" },
                        React.createElement(Title, { order: 2, ta: "center", mt: "sm" }, "Welcome to Ongoku"),
                        React.createElement(Text, { ta: "center" }, "Please log in to access the Ongoku App."),
                        React.createElement(LoginLink, null,
                            React.createElement(Button, null, "Log In")))))));
    }
    // Loading state
    if (loading) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { size: "sm", className: "py-20" },
                React.createElement(Card, { withBorder: true, shadow: "sm", p: "xl" },
                    React.createElement(Stack, { align: "center", gap: "md" },
                        React.createElement(Title, { order: 2, ta: "center", mt: "sm" }, "Loading..."),
                        React.createElement(Text, { c: "dimmed", ta: "center" }, "Please wait while we initialize the application."))))));
    }
    // Error state
    if (error) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { size: "sm", className: "py-20" },
                React.createElement(Card, { withBorder: true, shadow: "sm", p: "xl" },
                    React.createElement(Stack, { align: "center", gap: "md" },
                        React.createElement(Title, { order: 2, ta: "center", mt: "sm", c: "red" }, "Error"),
                        React.createElement(Text, { c: "red", ta: "center" }, error.message))))));
    }
    // App not loaded state
    if (!ongokuApp) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { size: "sm", className: "py-20" },
                React.createElement(Card, { withBorder: true, shadow: "sm", p: "xl" },
                    React.createElement(Stack, { align: "center", gap: "md" },
                        React.createElement(Title, { order: 2, ta: "center", mt: "sm" }, "App Not Loaded"),
                        React.createElement(Text, { c: "dimmed", ta: "center" }, "The Ongoku app could not be loaded."))))));
    }
    // Success state - Ongoku app is loaded
    return (React.createElement(SafeMantineProvider, null,
        React.createElement(Container, { size: "sm", className: "py-20" },
            React.createElement(Card, { withBorder: true, shadow: "sm", p: "xl" },
                React.createElement(Stack, { align: "center", gap: "md" },
                    React.createElement(Title, { order: 2, ta: "center", mt: "sm" }, "Welcome to the Dashboard!"),
                    React.createElement(Text, { ta: "center" }, "You have successfully accessed the Dashboard"),
                    React.createElement(Card, { withBorder: true, w: "100%", mt: "md", p: "xl", radius: "md" },
                        React.createElement(Stack, { gap: "md" },
                            React.createElement(Title, { order: 3 }, "App Information"),
                            React.createElement(Text, null,
                                "App Name: ",
                                ongokuApp.getName().toCapital()),
                            React.createElement(Text, null,
                                "Friendly Name: ",
                                ongokuApp.getNameFriendly()),
                            React.createElement(Text, null,
                                "Services: ",
                                ongokuApp.services.length),
                            React.createElement(Text, null,
                                "Entities: ",
                                ongokuApp.entityInfos.length),
                            React.createElement(Text, null,
                                "Types: ",
                                ongokuApp.typeInfos.length),
                            React.createElement(Text, null,
                                "Methods: ",
                                ongokuApp.methods.length),
                            React.createElement(Text, null,
                                "Initialized: ",
                                ongokuApp.isInitialized ? "Yes" : "No"))),
                    ongokuApp.services.length > 0 && (React.createElement(Card, { withBorder: true, w: "100%", mt: "md", p: "xl", radius: "md" },
                        React.createElement(Stack, { gap: "md" },
                            React.createElement(Title, { order: 3 },
                                "Services (",
                                ongokuApp.services.length,
                                ")"),
                            ongokuApp.services.slice(0, 5).map(function (service, index) {
                                var _a;
                                return (React.createElement(Card, { key: index, withBorder: true, p: "md", radius: "md" },
                                    React.createElement(Text, null, (_a = service.namespace.service) === null || _a === void 0 ? void 0 : _a.toCapital())));
                            }),
                            ongokuApp.services.length > 5 && (React.createElement(Text, { c: "dimmed", ta: "center" },
                                "And ",
                                ongokuApp.services.length - 5,
                                " more services..."))))),
                    ongokuApp.entityInfos.length > 0 && (React.createElement(Card, { withBorder: true, w: "100%", mt: "md", p: "xl", radius: "md" },
                        React.createElement(Stack, { gap: "md" },
                            React.createElement(Title, { order: 3 },
                                "Entities (",
                                ongokuApp.entityInfos.length,
                                ")"),
                            ongokuApp.entityInfos.slice(0, 5).map(function (entity, index) {
                                var _a;
                                return (React.createElement(Card, { key: index, withBorder: true, p: "md", radius: "md" },
                                    React.createElement(Text, null, (_a = entity.namespace.entity) === null || _a === void 0 ? void 0 : _a.toCapital())));
                            }),
                            ongokuApp.entityInfos.length > 5 && (React.createElement(Text, { c: "dimmed", ta: "center" },
                                "And ",
                                ongokuApp.entityInfos.length - 5,
                                " more entities..."))))),
                    props.children && (React.createElement(Card, { withBorder: true, w: "100%", mt: "md", p: "md" }, props.children)))))));
};
