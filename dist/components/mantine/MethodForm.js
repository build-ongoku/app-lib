'use client';
import { Title } from '@mantine/core';
import { AppContext } from '../../common/AppContextV3';
import { TypeAddFormWrapper } from './FormAddTypeWrapper';
import React, { useContext } from 'react';
export var MethodForm = function (props) {
    var service = props.service, entity = props.entity, method = props.method;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var mthd = appInfo.getMethod({ service: service, entity: entity, method: method });
    if (!mthd.namespace.method) {
        throw new Error('Method namespace does not have method');
    }
    if (!mthd.requestTypeNamespace) {
        throw new Error('Method does not have request type');
    }
    var reqTypeInfo = appInfo.getTypeInfo(mthd.requestTypeNamespace.toRaw());
    if (!reqTypeInfo) {
        throw new Error('Request type not found');
    }
    var postEndpoint = mthd.getAPIEndpoint();
    return (React.createElement("div", null,
        React.createElement(Title, { order: 1 },
            "Method: ",
            mthd.namespace.method.toCapital()),
        React.createElement(TypeAddFormWrapper, { typeInfo: reqTypeInfo, postEndpoint: postEndpoint })));
};
