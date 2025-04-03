'use client';
import React from 'react';
import { FormPasswordForgot } from './FormPasswordForgot';
export var PagePasswordForgot = function (props) {
    var router = props.router;
    return (React.createElement("div", null,
        React.createElement(FormPasswordForgot, { router: router })));
};
