import { Card, Button, Form, Input, Layout, Select, Spin } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext';
import { useMakeRequest } from '@ongoku/app-lib/src/providers/provider';
export var RegisterForm = function (props) {
    var _a = useAuth(), session = _a.session, authenticate = _a.authenticate, authLoading = _a.loading;
    var _b = useMakeRequest({
        method: 'POST',
        path: 'users/register',
        notifyOnError: true,
    }), _c = _b[0], data = _c.data, loading = _c.loading, fetch = _b[1];
    useEffect(function () {
        if (!authLoading && (data === null || data === void 0 ? void 0 : data.token)) {
            authenticate(data.token);
        }
    }, [authLoading, data]);
    if (authLoading || loading) {
        return React.createElement(Spin, null);
    }
    var onFinish = function (values) {
        console.log('Login Form: Submission', values);
        fetch({
            data: values,
        });
    };
    var inputStyles = {
        minWidth: 300,
        maxWidth: 600,
    };
    return (React.createElement(Card, { title: "Register" },
        React.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            } },
            React.createElement(Form, { name: "register", style: { maxWidth: 400 }, initialValues: { remember: true }, onFinish: onFinish },
                React.createElement(Form.Item, { name: "email", rules: [{ required: true, type: 'email' }], style: inputStyles },
                    React.createElement(Input, { prefix: React.createElement(MailOutlined, { className: "site-form-item-icon" }), placeholder: "Email" })),
                React.createElement(Form.Item, { name: "name" },
                    React.createElement(Form.Item, { name: ['name', 'first'], rules: [{ required: true }], style: inputStyles },
                        React.createElement(Input, { prefix: React.createElement(UserOutlined, { className: "site-form-item-icon" }), placeholder: "First Name" })),
                    React.createElement(Form.Item, { name: ['name', 'middle_initial'], rules: [{}], style: inputStyles },
                        React.createElement(Input, { prefix: React.createElement(UserOutlined, { className: "site-form-item-icon" }), placeholder: "Middle" })),
                    React.createElement(Form.Item, { name: ['name', 'last'], rules: [{}], style: inputStyles },
                        React.createElement(Input, { prefix: React.createElement(UserOutlined, { className: "site-form-item-icon" }), placeholder: "Last Name" }))),
                React.createElement(Form.Item, { name: "phone_number" },
                    React.createElement(Form.Item, { name: ['phone_number', 'country_code'], rules: [{ required: true, type: 'number' }], style: inputStyles },
                        React.createElement(Select, { style: inputStyles, placeholder: "Country Code" },
                            React.createElement(Select.Option, { value: 1 }, "+1"),
                            React.createElement(Select.Option, { value: 92 }, "+92"))),
                    React.createElement(Form.Item, { name: ['phone_number', 'number'], rules: [{}], style: inputStyles },
                        React.createElement(Input, { prefix: React.createElement(PhoneOutlined, { className: "site-form-item-icon" }), placeholder: "Phone Number" }))),
                React.createElement(Form.Item, { name: "password", rules: [{ required: true }], style: inputStyles },
                    React.createElement(Input.Password, { prefix: React.createElement(LockOutlined, { className: "site-form-item-icon" }), placeholder: "Password" })),
                React.createElement(Form.Item, null,
                    React.createElement(Button, { type: "primary", htmlType: "submit", style: { width: '100%' } }, "Register"))))));
};
export var RegisterPage = function (props) {
    return (React.createElement(Layout, null,
        React.createElement(Layout, null,
            React.createElement(Layout.Header, null),
            React.createElement(Layout.Content, null,
                React.createElement(RegisterForm, null)))));
};
