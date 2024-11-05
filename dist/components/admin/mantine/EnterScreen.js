'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Button, Container, Image, Title } from '@mantine/core';
import { useAuth } from '../../../common/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
export var EnterScreen = function (props) {
    return (React.createElement(Container, { className: "flex flex-col items-center justify-center h-screen" },
        React.createElement("div", { className: "m-auto text-center" },
            React.createElement("center", null,
                React.createElement(Image, { src: "/logo_1.png", alt: "OnGoku Logo", className: "m-auto", w: "auto", fit: "contain", height: 100 }),
                React.createElement(Title, { order: 1, className: "text-center" },
                    React.createElement("span", { className: "font-normal" }, "on"),
                    "goku admin tool"),
                React.createElement("p", { className: "text-center" },
                    React.createElement(EnterButton, __assign({}, props)))))));
};
var EnterButton = function (props) {
    var router = useRouter();
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useAuth(), session = _b.session, loadingSession = _b.loading;
    var redirectPath = loadingSession || !session ? props.unauthenticatedUserRedirectPath : props.authenticatedUserRedirectPath;
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { loading: loading, onClick: function () {
                setLoading(true);
                router.push(redirectPath);
            }, className: "m-auto" }, "Enter")));
};
