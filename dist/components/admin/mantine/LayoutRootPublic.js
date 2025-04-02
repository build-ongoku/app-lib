'use client';
import { Container, Image, Title } from '@mantine/core';
import { useAuth } from '../../../common/AuthContext';
import React, { useEffect } from 'react';
export var LayoutRootPublic = function (props) {
    var router = props.router, children = props.children;
    var _a = useAuth(), session = _a.session, loadingSession = _a.loading;
    // Do not allow authenticated users to access this part of the app.
    useEffect(function () {
        if (!loadingSession && session) {
            console.log('[LayoutRootPublic] [useEffect] User is authenticated. Redirecting to dashboard...', 'session', session);
            router.push('/home');
        }
    }, [session]);
    return (React.createElement(Container, { className: "flex h-screen justify-center" },
        React.createElement("div", { className: "m-auto" },
            React.createElement(Image, { src: "/logo_1.png", alt: "onhoku Logo", className: "m-auto", w: "auto", fit: "contain", height: 100 }),
            React.createElement(Title, { order: 1 },
                React.createElement("span", { className: "font-normal" }, "on"),
                "goku")),
        React.createElement("div", { className: "m-auto" }, children)));
};
