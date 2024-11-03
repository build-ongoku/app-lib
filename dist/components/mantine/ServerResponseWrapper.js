'use client';
import { Alert } from '@mantine/core';
import React from 'react';
import { ScreenLoader } from '../../components/admin/mantine/Loader';
export var ServerResponseWrapper = function (props) {
    if (props.loading) {
        return React.createElement(ScreenLoader, null);
    }
    if (props.error) {
        return React.createElement(Alert, { variant: "error" }, props.error);
    }
    return React.createElement(React.Fragment, null, props.children);
};
