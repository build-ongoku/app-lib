import { AppContext } from '../../common/AppContextV3.js';
import { TypeAddFormWrapper } from './FormAddTypeWrapper.js';
import React__default, { useContext } from 'react';
import { Title } from '../../node_modules/@mantine/core/esm/components/Title/Title.js';

var MethodForm = function (props) {
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
    return (React__default.createElement("div", null,
        React__default.createElement(Title, { order: 1 },
            "Method: ",
            mthd.namespace.method.toCapital()),
        React__default.createElement(TypeAddFormWrapper, { typeInfo: reqTypeInfo, postEndpoint: postEndpoint })));
};

export { MethodForm };
