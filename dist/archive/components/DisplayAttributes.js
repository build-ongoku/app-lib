import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext';
import { getValueForField } from '@ongoku/app-lib/src/common/Field';
import { EntityLinkFromID } from '@ongoku/app-lib/src/components/antd/EntityLink';
import ReactJson from '@microlink/react-json-view';
import React, { useContext, useState } from 'react';
export var FieldDisplay = function (props) {
    var fieldInfo = props.fieldInfo, objectValue = props.objectValue, DisplayComponent = props.DisplayComponent;
    var fieldValue = getValueForField({ obj: objectValue, fieldInfo: fieldInfo });
    return React.createElement(DisplayComponent, { value: fieldValue });
};
export var DefaultDisplay = function (props) {
    return React.createElement(React.Fragment, null, props.value);
};
export var ObjectDisplay = function (props) {
    return React.createElement(ReactJson, { src: props.value });
};
export var StringDisplay = function (props) {
    return React.createElement(React.Fragment, null, props.value);
};
export var BooleanDisplay = function (props) {
    // TODO: Handle null
    return React.createElement(React.Fragment, null, props.value ? 'YES' : 'NO');
};
export var DateDisplay = function (props) {
    var d = new Date(props.value);
    return React.createElement(DefaultDisplay, { value: d.toDateString() });
};
export var TimestampDisplay = function (props) {
    if (!props.value) {
        return (React.createElement("span", null,
            React.createElement("i", null, "No Data")));
    }
    var d = new Date(props.value);
    return React.createElement(DefaultDisplay, { value: d.toUTCString() });
};
export var RepeatedDisplay = function (props) {
    return (React.createElement("div", null,
        React.createElement("div", null,
            "Repeated Display: ",
            props.value.length,
            " items"),
        React.createElement("span", null, JSON.stringify(props.value))));
};
export var getForeignEntityFieldDisplayComponent = function (props) {
    var fieldInfo = props.fieldInfo;
    return function (props) {
        var _a = useState(), foreignEntityInfo = _a[0], setForeignEntityInfo = _a[1];
        // Get ServiceInfo from context
        var _b = useContext(AppInfoContext), appInfo = _b.appInfo, loading = _b.loading;
        if (!fieldInfo.foreignEntityInfo) {
            throw new Error('ForeignEntity DisplayProps for field with no foreignEntityInfo');
        }
        if (fieldInfo.foreignEntityInfo.serviceName && fieldInfo.foreignEntityInfo.entityName) {
            var foreignEntityInfoLocal = appInfo === null || appInfo === void 0 ? void 0 : appInfo.getEntityInfo(fieldInfo.foreignEntityInfo.serviceName, fieldInfo.foreignEntityInfo.entityName);
            if (foreignEntityInfoLocal) {
                setForeignEntityInfo(foreignEntityInfoLocal);
            }
        }
        var foreignEntityId = props.value;
        return React.createElement(EntityLinkFromID, { entityInfo: foreignEntityInfo, id: foreignEntityId });
    };
};
