import { Button, Card, Form, Input, Layout, Spin } from 'antd';
import { Navigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext';
import { useMakeRequest } from '@ongoku/app-lib/src/providers/provider';
// interface AuthenticateRequest {
//     email: string
//     password: string
// }
// interface AuthenticateResponse {
//     token: string
// }
export var LoginForm = function (props) {
    var _a = useAuth(), session = _a.session, authLoading = _a.loading, authenticate = _a.authenticate;
    var _b = useState(false), formSubmitted = _b[0], setFormSubmitted = _b[1];
    var _c = useMakeRequest({
        method: 'POST',
        path: 'users/login',
        notifyOnError: true,
    }), _d = _c[0], data = _d.data, error = _d.error, loading = _d.loading, fetch = _c[1];
    useEffect(function () {
        if (formSubmitted && (data === null || data === void 0 ? void 0 : data.token)) {
            authenticate(data.token);
        }
    }, [data === null || data === void 0 ? void 0 : data.token]);
    if (authLoading || loading) {
        return React.createElement(Spin, { size: "large" });
    }
    if (session) {
        console.log('User is already logged in. Redirecting...');
        return React.createElement(Navigate, { to: "/" });
    }
    var onFinish = function (values) {
        console.log('Login Form: Submission', values);
        if (!formSubmitted) {
            setFormSubmitted(true);
        }
        fetch({
            data: values,
        });
        console.log('Fetching/fetched:', loading, error, data);
    };
    var inputStyles = {
        minWidth: 300,
        maxWidth: 600,
    };
    return (React.createElement(Card, { title: "Login" },
        React.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            } },
            React.createElement(Form, { name: "normal_login", style: { maxWidth: 400 }, initialValues: { remember: true }, onFinish: onFinish },
                React.createElement(Form.Item, { name: "email", rules: [{ required: true, type: 'email' }], style: inputStyles },
                    React.createElement(Input, { prefix: React.createElement(UserOutlined, { className: "site-form-item-icon" }), placeholder: "Email" })),
                React.createElement(Form.Item, { name: "password", rules: [{ required: true }], style: inputStyles },
                    React.createElement(Input, { prefix: React.createElement(LockOutlined, { className: "site-form-item-icon" }), type: "password", placeholder: "Password" })),
                React.createElement(Form.Item, null,
                    React.createElement(Button, { type: "primary", htmlType: "submit", style: { width: '100%' } }, "Log in"),
                    "Or ",
                    React.createElement("a", { href: "/register" }, "register now!"))))));
};
export var LoginPage = function (props) {
    return (React.createElement(Layout, null,
        React.createElement(Layout, null,
            React.createElement(Layout.Header, null),
            React.createElement(Layout.Content, null,
                React.createElement(LoginForm, null)))));
};
