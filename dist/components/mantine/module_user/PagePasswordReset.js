'use client';
import { Alert } from '@mantine/core';
import React from 'react';
import { FormPasswordReset } from './FormPasswordReset';
import { useMakeRequest } from '../../../providers/httpV2';
import { ScreenLoader } from '../../../components/admin/mantine/Loader';
export var PagePasswordReset = function (props) {
    var _a;
    var router = props.router, searchParams = props.searchParams;
    var token = searchParams.get('token');
    var email = searchParams.get('email');
    var reqResp = useMakeRequest({
        method: 'GET',
        relativePath: '/v1/auth/validate_password_reset_token',
        data: { email: email, token: token },
        skipFetchAtInit: !token || !email,
    });
    if (!token || !email) {
        return React.createElement(Alert, { variant: "error" }, "The link is either invalid or has expired.");
    }
    if (reqResp.loading || !reqResp.fetchDone) {
        return React.createElement(ScreenLoader, null);
    }
    if (reqResp.error) {
        return React.createElement(Alert, { variant: "error" }, "The link is either invalid or has expired.");
    }
    if ((_a = reqResp.resp) === null || _a === void 0 ? void 0 : _a.error) {
        return React.createElement(Alert, { variant: "error" }, "The link is either invalid or has expired.");
    }
    return (React.createElement("div", null,
        React.createElement(FormPasswordReset, { email: email, token: token, router: router })));
};
