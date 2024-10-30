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
import { Button, Form, Layout, Spin, Typography } from 'antd';
import React, { useState } from 'react';
import { getEntityDetailPath } from '@ongoku/app-lib/src/components/EntityLink';
import { Link } from 'react-router-dom';
import { TypeFormItems } from '@ongoku/app-lib/src/components/Form';
import { capitalCase } from 'change-case';
import { useAddEntity } from '@ongoku/app-lib/src/providers/provider';
export var DefaultAddView = function (props) {
    var entityInfo = props.entityInfo;
    var _a = useState(false), submitted = _a[0], setSubmitted = _a[1];
    var _b = useState(null), entity = _b[0], setEntity = _b[1];
    var form = Form.useForm()[0];
    var _c = useAddEntity({
        entityInfo: entityInfo,
    }), _d = _c[0], loading = _d.loading, error = _d.error, data = _d.data, fetch = _c[1];
    console.log('States:', loading, error, data);
    if (!loading && !error && data && !entity) {
        console.log('Data:', data);
        setEntity(data);
    }
    var onFinish = function (values) {
        console.log('Form onFinish', values);
        fetch({ data: values });
        setSubmitted(true);
    };
    // After form has been submitted and entity created, redirect to the detail page
    if (submitted && entity) {
        console.log('Redirecting...');
        return React.createElement(Link, { to: getEntityDetailPath({ entityInfo: entityInfo, entity: entity }) });
    }
    var layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 },
    };
    var formItemProps = __assign({}, layout);
    var buttonStyle = {};
    return (React.createElement(Layout, null,
        React.createElement(Layout.Header, { style: { background: 'none' } },
            React.createElement(Typography.Title, { level: 3 },
                "Add ",
                capitalCase(entityInfo.name),
                " Form")),
        React.createElement(Layout.Content, null,
            React.createElement(Form, __assign({ form: form, onFinish: onFinish }, layout, { layout: 'horizontal' }),
                React.createElement(TypeFormItems, { typeInfo: entityInfo, formItemProps: formItemProps, usePlaceholders: true }),
                React.createElement(Form.Item, __assign({}, formItemProps, { wrapperCol: { offset: 3 } }),
                    React.createElement(Button, { type: "primary", htmlType: "submit", style: __assign({}, buttonStyle), key: "default-add-button" },
                        "Add ",
                        capitalCase(entityInfo.name)),
                    loading && React.createElement(Spin, null)))),
        React.createElement(Layout.Footer, null)));
};
