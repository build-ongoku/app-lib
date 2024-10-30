import { Button, Card, Result, Spin } from 'antd';
import { EntityAddLink } from '@ongoku/app-lib/src/components/EntityLink';
import { useListEntity } from '@ongoku/app-lib/src/providers/provider';
import React from 'react';
import Table from 'antd/lib/table/';
import { PlusOutlined } from '@ant-design/icons';
import { capitalCase } from 'change-case';
import { getFieldForFieldKind } from '../Field';
export var DefaultListView = function (_a) {
    var _b;
    var entityInfo = _a.entityInfo;
    console.log('List View: Rendering...', 'EntityInfo', entityInfo.name);
    var resp = useListEntity({
        entityInfo: entityInfo,
        params: {
            req: {},
        },
    })[0];
    console.log('List View: states', resp);
    if (resp.loading) {
        return React.createElement(Spin, { size: "large" });
    }
    if (resp.error) {
        return React.createElement(Result, { status: "error", title: "Something went wrong", subTitle: resp.error });
    }
    if (!resp.data) {
        return React.createElement(Result, { status: "error", subTitle: "Panic! No entity data returned" });
    }
    // Otherwise return a Table view
    console.log('* entityInfo.name: ', entityInfo.name);
    console.log('Columns', entityInfo.columnsFieldsForListView);
    var columns = entityInfo.columnsFieldsForListView.map(function (fieldName) {
        var fieldInfo = entityInfo.getFieldInfo(fieldName);
        if (!fieldInfo) {
            throw new Error("Attempted to fetch list column field '".concat(String(fieldName), "' for entity '").concat(entityInfo.name, "'"));
        }
        var fieldKind = fieldInfo === null || fieldInfo === void 0 ? void 0 : fieldInfo.kind;
        var fieldComponent = getFieldForFieldKind(fieldKind);
        console.log('* FieldName:', fieldName, 'FieldKind: ', fieldKind.name);
        var DisplayComponent = fieldComponent.getDisplayComponent(fieldInfo, entityInfo);
        return {
            title: fieldComponent.getLabel(fieldInfo),
            dataIndex: fieldName,
            render: function (value, entity) {
                console.log('List: Col: Entity ', entity, 'FieldInfo', fieldInfo);
                return React.createElement(DisplayComponent, { value: value });
            },
        };
    });
    var addButton = (React.createElement(EntityAddLink, { entityInfo: entityInfo },
        React.createElement(Button, { type: "primary", icon: React.createElement(PlusOutlined, null) },
            "Add ",
            capitalCase(entityInfo.getEntityName()))));
    return (React.createElement(Card, { title: "List ".concat(capitalCase(entityInfo.getEntityName())), extra: addButton },
        React.createElement(Table, { columns: columns, dataSource: (_b = resp.data) === null || _b === void 0 ? void 0 : _b.items, rowKey: function (record) { return record.id; } })));
};
