'use client';
import { Title, Text } from '@mantine/core';
import { AppContext } from '../../common/AppContextV3';
import { DtypeFormWrapper } from './FormAddTypeWrapper';
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
    var unsupported = false;
    if (!mthd.requestDtype) {
        unsupported = true;
        // throw new Error('Method does not have request type')
    }
    var api = mthd.getAPI();
    if (!api) {
        return React.createElement(Text, null,
            " Method ",
            mthd.namespace.method.toCapital(),
            " does not have an API defined. Hence, it cannot be called from a client app.");
    }
    var endpoint = api.getEndpoint();
    return (React.createElement("div", null,
        React.createElement(Title, { order: 1 },
            "Method: ",
            mthd.namespace.method.toCapital()),
        unsupported || !mthd.requestDtype ? React.createElement(Text, null,
            "The ",
            mthd.namespace.method.toCapital(),
            " method is a special method which is not supported by the methods explorer of the Admin UI app.") :
            React.createElement(DtypeFormWrapper, { dtype: mthd.requestDtype, postEndpoint: endpoint, method: api.method })));
};
