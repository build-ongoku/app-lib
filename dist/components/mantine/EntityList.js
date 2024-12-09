'use client';
import { Anchor, Button, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { getEntityAddPath } from '../../components/EntityLink';
import { useListEntity } from '../../providers/httpV2';
import { ServerResponseWrapper } from './ServerResponseWrapper';
import { pluralize } from '../../common/namespacev2';
dayjs.extend(relativeTime);
var getDefaultEntityColumns = function (entityInfo) { return [
    {
        id: 'identifier',
        accessorFn: function (row) {
            return entityInfo.getEntityNameFriendly(row);
        },
        header: 'Identifier',
        Cell: function (_a) {
            var cell = _a.cell, row = _a.row;
            var entity = row.original;
            var name = entityInfo.getEntityNameFriendly(entity);
            var id = entity.id;
            return (React.createElement(Anchor, { key: id, href: "".concat(entityInfo.namespace.toURLPath(), "/").concat(id) }, name));
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell: function (_a) {
            var cell = _a.cell;
            var value = cell.getValue();
            var displayValue = dayjs(value).fromNow();
            return React.createElement(Text, null, displayValue);
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell: function (_a) {
            var cell = _a.cell;
            var value = cell.getValue();
            var displayValue = dayjs(value).fromNow();
            return React.createElement(Text, null, displayValue);
        },
    },
]; };
// EntityListTable fetches the list of entities and renders the table
export var EntityListTable = function (props) {
    var entityInfo = props.entityInfo;
    var router = useRouter();
    // Get the entity from the server
    var _a = useListEntity({
        entityNamespace: entityInfo.namespace.toRaw(),
        data: {},
    }), resp = _a.resp, error = _a.error, loading = _a.loading, fetchDone = _a.fetchDone, fetch = _a.fetch;
    return (React.createElement("div", null,
        React.createElement(ServerResponseWrapper, { error: error || (resp === null || resp === void 0 ? void 0 : resp.error), loading: loading },
            React.createElement("div", { className: "flex justify-between my-5" },
                React.createElement(Title, { order: 2 },
                    "Your ",
                    pluralize(entityInfo.getNameFriendly())),
                React.createElement(Button, { onClick: function () {
                        router.push(getEntityAddPath(entityInfo));
                    } },
                    "Add ",
                    entityInfo.getNameFriendly())),
            (resp === null || resp === void 0 ? void 0 : resp.data) && React.createElement(EntityListTableInner, { entityInfo: entityInfo, data: resp.data }))));
};
// EntityListTableInner takes the list response and renders the table
export var EntityListTableInner = function (props) {
    var _a, _b, _c;
    var cols = getDefaultEntityColumns(props.entityInfo);
    var colsMemo = useMemo(function () { return cols; }, []);
    var fancyTable = ((_b = (_a = props.data) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) > 10;
    var table = useMantineReactTable({
        columns: colsMemo,
        data: (_c = props.data.items) !== null && _c !== void 0 ? _c : [],
        enableColumnActions: fancyTable,
        enableColumnFilters: fancyTable,
        enablePagination: fancyTable,
        enableSorting: fancyTable,
        mantineTableProps: {
            withColumnBorders: false,
        },
    });
    return React.createElement(MantineReactTable, { table: table });
};
