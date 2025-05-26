'use client';
import { useApp } from '../../providers/AppProvider';
import { EntityDetail } from '../components/EntityDetail';
import React from 'react';
export var PageEntityDetail = function (props) {
    var _a = props.params, serviceSlug = _a.serviceSlug, entitySlug = _a.entitySlug, entityIdentifier = _a.entityIdentifier;
    var ongokuApp = useApp().ongokuApp;
    if (!ongokuApp) {
        throw new Error('AppInfo not loaded');
    }
    var entityInfo = ongokuApp.getEntityInfo({ service: serviceSlug, entity: entitySlug });
    if (!entityInfo) {
        throw new Error('EntityInfo not found');
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(EntityDetail, { entityInfo: entityInfo, identifier: entityIdentifier })));
};
