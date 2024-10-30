import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3';
import { EntityListTable } from '@ongoku/app-lib/src/components/mantine/EntityList';
import React, { useContext } from 'react';
export var PageEntityList = function (props) {
    var _a = props.params, serviceName = _a.service, entityName = _a.entity;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var entityInfo = appInfo.getEntityInfo({ service: serviceName, entity: entityName });
    if (!entityInfo) {
        throw new Error('EntityInfo not found');
    }
    return (React.createElement("div", null,
        React.createElement(EntityListTable, { entityInfo: entityInfo })));
};
