'use client';
import { useForm } from '@mantine/form';
import { AppContext } from '../../common/AppContextV3';
import { discardableInputKey, Form } from './Form';
import { GenericDtypeInput, TypeAddForm } from './FormAdd';
import React, { useContext } from 'react';
export var DtypeFormWrapper = function (props) {
    var _a;
    var _b;
    var router = props.router;
    var dtype = props.dtype;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var _c = React.useState(null), response = _c[0], setResponse = _c[1];
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: (_a = {},
            _a[discardableInputKey] = props.initialData || dtype.getEmptyValue(appInfo) || undefined,
            _a),
    });
    console.log('[DtypeFormWrapper] Rendering...', 'dtype', dtype);
    return (React.createElement(Form, { form: form, postEndpoint: props.postEndpoint, method: props.method, submitButtonText: props.submitText, redirectPath: props.redirectPath, onSuccess: function (data) {
            console.log('[TypeAddFormWrapper] [onSuccess]', 'data', data);
            setResponse(data);
        }, router: router },
        React.createElement(GenericDtypeInput, { dtype: dtype, label: (_b = props.label) !== null && _b !== void 0 ? _b : 'Request', form: form, identifier: discardableInputKey }),
        response && React.createElement("pre", null, JSON.stringify(response, null, 2))));
};
export var TypeAddFormWrapper = function (props) {
    var typeInfo = props.typeInfo, router = props.router;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var _a = React.useState(null), response = _a[0], setResponse = _a[1];
    var initialData = props.initialData || typeInfo.getEmptyObject(appInfo) || {};
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: initialData,
    });
    console.log('[TypeAddFormWrapper] Rendering...', 'typeInfo', typeInfo);
    return (React.createElement(Form, { form: form, submitButtonText: props.submitText, postEndpoint: props.postEndpoint, redirectPath: props.redirectPath, onSuccess: function (data) {
            console.log('[TypeAddFormWrapper] [onSuccess]', 'data', data);
            setResponse(data);
        }, router: router },
        React.createElement(TypeAddForm, { typeInfo: typeInfo, form: form }),
        response && React.createElement("pre", null, JSON.stringify(response, null, 2))));
};
