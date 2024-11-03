'use client';
import { AppContext } from '../../common/AppContextV3';
import { EntityDetail } from './EntityDetail';
import React, { useContext } from 'react';
export var PageEntityDetail = function (props) {
    var _a = props.params, serviceName = _a.service, entityName = _a.entity;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var entityInfo = appInfo.getEntityInfo({ service: serviceName, entity: entityName });
    if (!entityInfo) {
        throw new Error('EntityInfo not found');
    }
    // Get the entity from the server
    var identifier = props.params.identifier;
    return (React.createElement(React.Fragment, null,
        React.createElement(EntityDetail, { entityInfo: entityInfo, identifier: identifier })));
};
