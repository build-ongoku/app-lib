import { Card, Result, Spin } from 'antd';
import React from 'react';
import { TypeDisplay } from '@ongoku/app-lib/src/components/DisplayAttributes/DisplayAttributes';
import { useGetEntity } from '@ongoku/app-lib/src/providers/provider';
export var DefaultDetailView = function (props) {
    var entityInfo = props.entityInfo, objectId = props.objectId;
    var _a = useGetEntity({ entityInfo: entityInfo, params: { id: objectId } })[0], loading = _a.loading, error = _a.error, entity = _a.data;
    if (loading) {
        return React.createElement(Spin, { size: "large" });
    }
    if (error) {
        return React.createElement(Result, { status: "error", title: "Something went wrong", subTitle: error });
    }
    if (!entity) {
        return React.createElement(Result, { status: "error", subTitle: "No entity data returned" });
    }
    // Otherwise return a Table view
    return (React.createElement(Card, { title: entityInfo.getNameFormatted() + ': ' + entityInfo.getHumanName(entity) },
        React.createElement(TypeDisplay, { typeInfo: entityInfo, objectValue: entity })));
};
