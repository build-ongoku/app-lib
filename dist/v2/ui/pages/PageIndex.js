"use client";
import React from "react";
import { Button, Container, Image, Stack, Title, Center } from "@mantine/core";
import { SafeMantineProvider, useUIFramework, useAuth, } from "../../providers/index-client";
export var PageIndex = function (props) {
    // Destructure all props at once
    var _a = props.appName, appName = _a === void 0 ? "Ongoku Admin Tool" : _a, 
    // Auth props are optional as we can get them from context
    propIsAuthenticated = props.isAuthenticated, propIsAuthLoading = props.isAuthLoading, LoginLink = props.LoginLink, RegisterLink = props.RegisterLink, LogoutLink = props.LogoutLink;
    // Get UI framework components
    var LinkComponent = useUIFramework().LinkComponent;
    // Get auth from dedicated AuthProvider
    var authContext = useAuth();
    // Use props if provided, otherwise fall back to context
    // Priority: 1. Props, 2. AuthProvider
    // This allows the component to work with or without explicit auth props
    var isAuthenticated = propIsAuthenticated !== undefined
        ? propIsAuthenticated
        : authContext.isAuthenticated;
    var isAuthLoading = propIsAuthLoading !== undefined
        ? propIsAuthLoading
        : authContext.isLoading;
    // Common button styles
    var btnStyle = { minWidth: "200px" };
    // Mantine-styled version of Home with inline components
    return (React.createElement(SafeMantineProvider, null,
        React.createElement(Center, { style: { minHeight: "100vh" } },
            React.createElement(Container, { size: "sm" },
                React.createElement(Stack, { align: "center", gap: "xl" },
                    React.createElement(Image, { src: "/logo/logo-spike-blk-lg.png", alt: "Ongoku Logo", w: "auto", fit: "contain", h: 120 }),
                    React.createElement(Title, { order: 1, ta: "center" }, appName),
                    React.createElement(Stack, { align: "center", gap: "md", style: { minWidth: "200px" } }, isAuthLoading ? (React.createElement(Button, { disabled: true }, "Loading...")) : isAuthenticated ? (React.createElement(React.Fragment, null,
                        React.createElement(Button, { component: LinkComponent, href: "/dashboard", color: "blue", size: "md", fullWidth: true, style: btnStyle }, "Dashboard"),
                        React.createElement(LogoutLink, null,
                            React.createElement(Button, { variant: "outline", color: "red", size: "md", fullWidth: true, style: btnStyle }, "Log out")))) : (React.createElement(React.Fragment, null,
                        React.createElement(LoginLink, null,
                            React.createElement(Button, { color: "blue", size: "md", fullWidth: true, style: btnStyle }, "Log in")),
                        React.createElement(RegisterLink, null,
                            React.createElement(Button, { variant: "outline", color: "blue", size: "md", fullWidth: true, style: btnStyle }, "Register"))))))))));
};
