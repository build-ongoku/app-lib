import { Button, Title } from '@mantine/core';
import { getEntityAddPath } from '@ongoku/app-lib/src/components/EntityLink';
import { ServerResponseWrapper } from '@ongoku/app-lib/src/components/mantine/ServerResponseWrapper';
import { useListEntity } from '@ongoku/app-lib/src/providers/provider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
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
            return React.createElement("a", { href: "".concat(entityInfo.namespace.toURLPath(), "/").concat(id) }, name);
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell: function (_a) {
            var cell = _a.cell;
            var value = cell.getValue();
            var displayValue = dayjs(value).fromNow();
            return React.createElement("span", null, displayValue);
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell: function (_a) {
            var cell = _a.cell;
            var value = cell.getValue();
            var displayValue = dayjs(value).fromNow();
            return React.createElement("span", null, displayValue);
        },
    },
]; };
// EntityListTable fetches the list of entities and renders the table
export var EntityListTable = function (props) {
    var entityInfo = props.entityInfo;
    var router = useRouter();
    // Get the entity from the server
    var resp = useListEntity({
        entityInfo: entityInfo,
        data: {},
    })[0];
    return (React.createElement("div", null,
        React.createElement(ServerResponseWrapper, { error: resp.error, loading: resp.loading },
            React.createElement("div", { className: "flex justify-between my-5" },
                React.createElement(Title, { order: 2 },
                    "Your ",
                    entityInfo.getNameFriendly()),
                React.createElement(Button, { onClick: function () {
                        router.push(getEntityAddPath(entityInfo));
                    } },
                    "Add ",
                    entityInfo.getNameFriendly())),
            resp.data && React.createElement(EntityListTableInner, { entityInfo: entityInfo, data: resp.data }))));
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
