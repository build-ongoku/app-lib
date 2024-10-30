import { AppContext } from '../../common/AppContextV3.js';
import { EntityAddForm } from './EntityAdd.js';
import React__default, { useContext } from 'react';
import { Title } from '../../node_modules/@mantine/core/esm/components/Title/Title.js';

var PageEntityAdd = function (props) {
    var _a = props.params, serviceName = _a.service, entityName = _a.entity;
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
    return (React__default.createElement("div", null,
        React__default.createElement(Title, { order: 1 },
            "Add ", entityInfo === null || entityInfo === void 0 ? void 0 :
            entityInfo.getNameFriendly()),
        React__default.createElement(EntityAddForm, { entityInfo: entityInfo, initialData: typeInfo.getEmptyObject(appInfo) })));
};

export { PageEntityAdd };
