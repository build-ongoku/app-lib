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
import { Button, Form, Layout, Result, Spin, Typography } from 'antd';
import { getEntityDetailPath } from '@ongoku/app-lib/src/components/EntityLink';
import { Link } from 'react-router-dom';
import React from 'react';
import { useGetEntity, useUpdateEntity } from '@ongoku/app-lib/src/providers/provider';
import { TypeFormItems } from '@ongoku/app-lib/src/components/Form';
import { capitalCase } from 'change-case';
export var DefaultEditView = function (props) {
    var entityInfo = props.entityInfo, objectId = props.objectId;
    var _a = useGetEntity({ entityInfo: entityInfo, params: { id: objectId } })[0], loadingGet = _a.loading, errorGet = _a.error, entity = _a.data;
    var form = Form.useForm()[0];
    var _b = useUpdateEntity({
        entityInfo: entityInfo,
    }), _c = _b[0], loading = _c.loading, error = _c.error, data = _c.data, fetch = _b[1];
    console.log('States:', loading, error, data);
    if (loadingGet || loading) {
        return React.createElement(Spin, { size: "large" });
    }
    if (errorGet || error) {
        return React.createElement(Result, { status: "error", title: "Something went wrong", subTitle: errorGet });
    }
    if (!entity) {
        return React.createElement(Result, { status: "error", subTitle: "Panic! No entity data returned" });
    }
    var onFinish = function (values) {
        console.log('Form onFinish', values);
        values.id = entity.id; // since the form values do not have fields without a displayed input
        fetch({
            data: {
                object: values,
            },
        });
    };
    // After form has been submitted and entity created, redirect to the detail page
    if (!loading && !error && data) {
        console.log('Redirecting...');
        return React.createElement(Link, { to: getEntityDetailPath({ entityInfo: entityInfo, entity: entity }) });
    }
    var layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 },
    };
    var formItemProps = __assign(__assign({}, layout), { initialValue: entity });
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
