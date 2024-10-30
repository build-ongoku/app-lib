import { AppContext } from '../../common/AppContextV3.js';
import { Form } from './Form.js';
import { TypeAddForm } from './FormAdd.js';
import { joinURL } from '../../providers/provider.js';
import { n as navigationExports } from '../../_virtual/navigation.js';
import React__default, { useContext } from 'react';
import { useForm } from '../../node_modules/@mantine/form/esm/use-form.js';

var EntityAddForm = function (props) {
    var entityInfo = props.entityInfo;
    var initialData = props.initialData || {};
    // Todo: remove dependency on next/navigation
    var router = navigationExports.useRouter();
    var form = useForm({
        mode: 'uncontrolled',
        validate: {},
        initialValues: initialData,
    });
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var typeNs = entityInfo.getTypeNamespace();
    var typeInfo = appInfo.getTypeInfo(typeNs.toRaw());
    if (!typeInfo) {
        throw new Error('TypeInfo not found for ' + typeNs);
    }
    console.log('[EntityAddForm] Rendering...', 'entityInfo', entityInfo);
    return (React__default.createElement(Form, { form: form, submitButtonText: "Add ".concat(entityInfo.getNameFriendly()), onSubmitTransformValues: function (values) {
            return {
                object: values,
            };
        }, postEndpoint: joinURL('v1', entityInfo.namespace.toURLPath()), onSuccess: function (data) {
            console.log('[EntityAddForm] [onSuccess]', 'data', data);
            if (data.id) {
                var redirectURL = joinURL(entityInfo.namespace.toURLPath(), data.id);
                console.log('[EntityAddForm] [onSuccess] Redirecting to', redirectURL);
                router.push(redirectURL);
                return;
            }
        } },
        React__default.createElement(TypeAddForm, { typeInfo: typeInfo, form: form })));
};

export { EntityAddForm };
