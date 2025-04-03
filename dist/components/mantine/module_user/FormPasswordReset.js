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
import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { Form } from '../Form';
export var FormPasswordReset = function (props) {
    var email = props.email, token = props.token, router = props.router;
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: email,
            password: '',
            confirmPassword: '',
            token: token
        },
        validate: {
            password: function (value) { return (value.length >= 8 ? null : 'Password must be at least 8 characters'); },
            confirmPassword: function (value, values) {
                return value === values.password ? null : 'Passwords do not match';
            },
        },
    });
    return (React.createElement(Container, { className: "w-96" },
        React.createElement(Form, { form: form, title: "Reset password", submitButtonText: "Reset Password", bottomExtra: React.createElement("div", { className: "flex justify-between w-full" },
                React.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                        router.push('/login');
                    } }, "Go to login")), postEndpoint: "/v1/auth/reset_password", onSubmitTransformValues: function (values) { return ({
                token: values.token,
                password: values.password,
                email: values.email
            }); }, onSuccessMessage: function (data) { return data.message; }, redirectPath: undefined, router: router },
            React.createElement(TextInput, __assign({ label: "Email", key: form.key('email'), disabled: true }, form.getInputProps('email'))),
            React.createElement(PasswordInput, __assign({ label: "New Password", placeholder: "Enter new password", key: form.key('password') }, form.getInputProps('password'))),
            React.createElement(PasswordInput, __assign({ label: "Confirm Password", placeholder: "Confirm new password", key: form.key('confirmPassword'), mt: "md" }, form.getInputProps('confirmPassword'))))));
};
