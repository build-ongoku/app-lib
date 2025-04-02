'use client';
import { Title } from '@mantine/core';
import { AppContext } from '../../common/AppContextV3';
import { EntityEditForm } from './EntityEdit';
import React, { useContext } from 'react';
export var PageEntityEdit = function (props) {
    var router = props.router;
    var _a = props.params, serviceName = _a.service, entityName = _a.entity, identifier = _a.identifier;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var entityInfo = appInfo.getEntityInfo({ service: serviceName, entity: entityName });
    if (!entityInfo) {
        throw new Error('EntityInfo not found');
    }
    // Get TypeInfo
    var typeNs = entityInfo.getTypeNamespace();
    var typeInfo = appInfo.getTypeInfo(typeNs.toRaw());
    if (!typeInfo) {
        console.error('[Page] [Add] TypeInfo not found', 'typeNs', typeNs);
        throw new Error('TypeInfo not found for ' + typeNs);
    }
    return (React.createElement("div", null,
        React.createElement(Title, { order: 1 },
            "Edit ", entityInfo === null || entityInfo === void 0 ? void 0 :
            entityInfo.getNameFriendly()),
        React.createElement(EntityEditForm, { entityInfo: entityInfo, objectId: identifier, router: router })));
};
