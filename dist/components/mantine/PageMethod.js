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
import { MethodForm } from './MethodForm';
import React from 'react';
export var PageMethod = function (props) {
    var router = props.router;
    return React.createElement(MethodForm, __assign({}, props.params, { router: router }));
};
