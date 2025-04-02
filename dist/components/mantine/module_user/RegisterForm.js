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
import { useAuth } from '../../../common/AuthContext';
import { Form } from '../Form';
import React from 'react';
/*
interface IRegisterForm {
    email: string
    password: string
    name: {
        firstName: string
        lastName: string
    }
}*/
export var RegisterForm = function (props) {
    var router = props.router;
    var authenticate = useAuth().authenticate;
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: undefined,
            password: undefined,
            name: {
                firstName: undefined,
                lastName: undefined,
            },
        },
        // skip type check for now
        validate: {
            // Commented out for DEV purposes
            email: function (value) { return (value && /^\S+@\S+$/.test(value) ? null : 'Invalid email'); },
        },
    });
    return (React.createElement(Container, { className: "w-96" },
        React.createElement(Form, { form: form, postEndpoint: "/v1/auth/register", submitButtonText: "Create Account", bottomExtra: React.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                    router.push('/login');
                } }, "Existing account?"), onSuccess: function (data) {
                if (data.token) {
                    authenticate(data.token);
                    return;
                }
                throw new Error('Login call succeeded but no token was returned.');
            }, redirectPath: "/home", router: router },
            React.createElement(TextInput, __assign({ label: "Email", placeholder: "you@email.com", key: form.key('email') }, form.getInputProps('email'))),
            React.createElement(PasswordInput, __assign({ className: "", label: "Password", placeholder: "super-secret-password", key: form.key('password'), mt: "md" }, form.getInputProps('password'))),
            React.createElement(TextInput, __assign({ label: "First Name", placeholder: "John", key: form.key('name.firstName') }, form.getInputProps('name.firstName'))),
            React.createElement(TextInput, __assign({ label: "Last Name", placeholder: "Doe", key: form.key('name.lastName') }, form.getInputProps('name.lastName'))))));
};
