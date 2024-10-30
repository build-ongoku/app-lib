import { getEntityAddPath } from '../EntityLink.js';
import { ServerResponseWrapper } from './ServerResponseWrapper.js';
import { useListEntity } from '../../providers/provider.js';
import dayjs from '../../_virtual/dayjs.min.js';
import relativeTime from '../../_virtual/relativeTime.js';
import { useMantineReactTable, MantineReactTable } from '../../node_modules/mantine-react-table/dist/index.esm.js';
import '../../node_modules/mantine-react-table/styles.css.js';
import { n as navigationExports } from '../../_virtual/navigation.js';
import React__default, { useMemo } from 'react';
import { Title } from '../../node_modules/@mantine/core/esm/components/Title/Title.js';
import { Button } from '../../node_modules/@mantine/core/esm/components/Button/Button.js';

dayjs.extend(relativeTime);
var getDefaultEntityColumns = function (entityInfo) { return [
    {
        id: 'identifier',
        accessorFn: function (row) {
            return entityInfo.getEntityNameFriendly(row);
        },
        header: 'Identifier',
        Cell: function (_a) {
            _a.cell; var row = _a.row;
            var entity = row.original;
            var name = entityInfo.getEntityNameFriendly(entity);
            var id = entity.id;
            return React__default.createElement("a", { href: "".concat(entityInfo.namespace.toURLPath(), "/").concat(id) }, name);
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell: function (_a) {
            var cell = _a.cell;
            var value = cell.getValue();
            var displayValue = dayjs(value).fromNow();
            return React__default.createElement("span", null, displayValue);
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell: function (_a) {
            var cell = _a.cell;
            var value = cell.getValue();
            var displayValue = dayjs(value).fromNow();
            return React__default.createElement("span", null, displayValue);
        },
    },
]; };
// EntityListTable fetches the list of entities and renders the table
var EntityListTable = function (props) {
    var entityInfo = props.entityInfo;
    var router = navigationExports.useRouter();
    // Get the entity from the server
    var resp = useListEntity({
        entityInfo: entityInfo,
        data: {},
    })[0];
    return (React__default.createElement("div", null,
        React__default.createElement(ServerResponseWrapper, { error: resp.error, loading: resp.loading },
            React__default.createElement("div", { className: "flex justify-between my-5" },
                React__default.createElement(Title, { order: 2 },
                    "Your ",
                    entityInfo.getNameFriendly()),
                React__default.createElement(Button, { onClick: function () {
                        router.push(getEntityAddPath(entityInfo));
                    } },
                    "Add ",
                    entityInfo.getNameFriendly())),
            resp.data && React__default.createElement(EntityListTableInner, { entityInfo: entityInfo, data: resp.data }))));
};
// EntityListTableInner takes the list response and renders the table
var EntityListTableInner = function (props) {
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
    return React__default.createElement(MantineReactTable, { table: table });
};

export { EntityListTable, EntityListTableInner };
