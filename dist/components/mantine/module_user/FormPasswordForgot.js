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
import { Anchor, Container, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import React from 'react';
import { Form } from '../Form';
import { joinURLNoPrefixSlash } from '../../../providers/provider';
export var FormPasswordForgot = function (props) {
    var router = props.router;
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            hostURL: joinURLNoPrefixSlash(window.location.origin, "password", "reset"),
        },
        validate: {
            email: function (value) { return (isEmail(value) ? null : 'Invalid email'); },
        },
    });
    return (React.createElement(Container, { className: "w-96" },
        React.createElement(Form, { title: "Forgot password?", form: form, submitButtonText: "Reset Password", bottomExtra: React.createElement("div", { className: "flex justify-between w-full" },
                React.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                        router.push('/login');
                    } }, "Back to login"),
                React.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                        router.push('/register');
                    } }, "Create an account")), postEndpoint: "/v1/auth/password_reset_token", onSuccessMessage: function (data) { return data.message; }, redirectPath: undefined, router: router },
            React.createElement(TextInput, __assign({ label: "Email", placeholder: "you@email.com", key: form.key('email') }, form.getInputProps('email'))))));
};
