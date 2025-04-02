'use client';
import { useForm } from '@mantine/form';
import { AppContext } from '../../common/AppContextV3';
import { Form } from './Form';
import { TypeAddForm } from './FormAdd';
import { joinURL } from '../../providers/provider';
import React, { useContext } from 'react';
import { getUpdateEntityMethodAndPath, useGetEntity } from '../../providers/httpV2';
import { ServerResponseWrapper } from './ServerResponseWrapper';
import { Title } from '@mantine/core';
export var EntityEditForm = function (props) {
    var entityInfo = props.entityInfo, objectId = props.objectId, key = props.key, router = props.router;
    // Get the entity data from the server
    var _a = useGetEntity({
        data: {
            id: objectId,
        },
        entityNamespace: entityInfo.namespace.toRaw(),
    }), resp = _a.resp, error = _a.error, loading = _a.loading;
    return (React.createElement(ServerResponseWrapper, { loading: loading, error: error || (resp === null || resp === void 0 ? void 0 : resp.error) }, (resp === null || resp === void 0 ? void 0 : resp.data) && React.createElement(EntityEditFormInner, { key: key, entityInfo: entityInfo, object: resp === null || resp === void 0 ? void 0 : resp.data, router: router })));
};
var EntityEditFormInner = function (props) {
    var entityInfo = props.entityInfo, object = props.object, router = props.router;
    // Todo: remove dependency on next/navigation
    var form = useForm({
        mode: 'uncontrolled',
        validate: {},
        initialValues: object,
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
    var _a = getUpdateEntityMethodAndPath(entityInfo.namespace.toRaw()), relPath = _a.relPath, method = _a.method;
    return (React.createElement(React.Fragment, null,
        React.createElement(Title, { order: 3 },
            entityInfo.getEntityNameFriendly(object),
            " [",
            object.id,
            "]"),
        React.createElement(Form, { form: form, submitButtonText: "Save", onSubmitTransformValues: function (values) {
                return {
                    object: values,
                };
            }, postEndpoint: relPath, method: method, onSuccess: function (data) {
                console.log('[EntityAddForm] [onSuccess]', 'data', data);
                if (data.object.id) {
                    var redirectURL = joinURL(entityInfo.namespace.toURLPath(), data.object.id);
                    console.log('[EntityEditForm] [onSuccess] Redirecting to', redirectURL);
                    router.push(redirectURL);
                    return;
                }
            }, router: router },
            React.createElement(TypeAddForm, { typeInfo: typeInfo, form: form, initialData: object }))));
};
