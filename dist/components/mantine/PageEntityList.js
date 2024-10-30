import { AppContext } from '../../common/AppContextV3.js';
import { EntityListTable } from './EntityList.js';
import React__default, { useContext } from 'react';

var PageEntityList = function (props) {
    var _a = props.params, serviceName = _a.service, entityName = _a.entity;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var entityInfo = appInfo.getEntityInfo({ service: serviceName, entity: entityName });
    if (!entityInfo) {
        throw new Error('EntityInfo not found');
    }
    return (React__default.createElement("div", null,
        React__default.createElement(EntityListTable, { entityInfo: entityInfo })));
};

export { PageEntityList };
