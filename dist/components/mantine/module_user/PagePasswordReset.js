'use client';
import { Alert, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { FormPasswordReset } from './FormPasswordReset';
import { makeRequest } from '../../../providers/httpV2';
export var PagePasswordReset = function (props) {
    var router = props.router, searchParams = props.searchParams;
    var token = searchParams.get('token');
    var email = searchParams.get('email');
    var _a = React.useState(undefined), tokenValid = _a[0], setTokenValid = _a[1];
    useEffect(function () {
        if (!token || !email) {
            setTokenValid(false);
            return;
        }
        // TODO: Make an API call to validate the token (and email)
        makeRequest({
            method: 'GET',
            relativePath: '/api/v1/auth/validate_password_reset_token',
            data: { email: email, token: token }
        }).then(function () {
            setTokenValid(true);
        }).catch(function () {
            setTokenValid(false);
        });
    }, [token, email]);
    if (!email || !token || !tokenValid) {
        return React.createElement(Alert, { variant: "error" }, "The link is either invalid or has expired.");
    }
    return (React.createElement("div", null,
        React.createElement(Title, { order: 1 }, "Reset Password"),
        React.createElement(FormPasswordReset, { email: email, token: token, router: router })));
};
