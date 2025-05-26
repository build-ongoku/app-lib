'use client';
import React from 'react';
import { useApp } from '../../providers/AppProvider';
import { EntityList } from '../components/EntityList';
import { usePromiseValue } from '../../utils/index-client';
export var PageEntityList = function (props) {
    var _a = usePromiseValue(props.params, { serviceSlug: '', entitySlug: '' }), params = _a.value, isLoadingParams = _a.isLoading, errorParams = _a.error;
    var _b = useApp(), ongokuApp = _b.ongokuApp, isLoadingApp = _b.loading, errorApp = _b.error;
    if (isLoadingParams || isLoadingApp) {
        return React.createElement("div", null, "Loading...");
    }
    if (errorParams || errorApp) {
        return React.createElement("div", null,
            "Error: ",
            (errorParams === null || errorParams === void 0 ? void 0 : errorParams.message) || (errorApp === null || errorApp === void 0 ? void 0 : errorApp.message));
    }
    if (!ongokuApp) {
        throw new Error('AppInfo not loaded');
    }
    var entityInfo = ongokuApp.getEntityInfo({ service: params.serviceSlug, entity: params.entitySlug });
    if (!entityInfo) {
        throw new Error('EntityInfo not found');
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(EntityList, { entityInfo: entityInfo })));
};
