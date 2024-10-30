import { useForm } from '@mantine/form';
import { AppContext } from '../../common/AppContextV3';
import { Form } from './Form';
import { TypeAddForm } from './FormAdd';
import { joinURL } from '../../providers/provider';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
export var EntityAddForm = function (props) {
    var entityInfo = props.entityInfo;
    var initialData = props.initialData || {};
    // Todo: remove dependency on next/navigation
    var router = useRouter();
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
    return (React.createElement(Form, { form: form, submitButtonText: "Add ".concat(entityInfo.getNameFriendly()), onSubmitTransformValues: function (values) {
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
        React.createElement(TypeAddForm, { typeInfo: typeInfo, form: form })));
};
