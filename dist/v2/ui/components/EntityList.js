'use client';
import React from 'react';
import { Button, Text, Title, Table, Card, Container, Pagination, Alert, Loader } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';
import { getEntityDetailPath } from './EntityLink';
import { useListEntity } from '../../utils/index-client';
import { MdAdd, MdChat } from 'react-icons/md';
import { useApp } from '../../providers/AppProvider';
import { SafeMantineProvider } from '../../providers/SafeMantineProvider';
import { useUIFramework } from '../../providers/UIFrameworkProvider';
dayjs.extend(relativeTime);
export var EntityList = function (props) {
    var _a, _b;
    var entityInfo = props.entityInfo;
    var router = useUIFramework().router;
    var _c = useApp(), ongokuApp = _c.ongokuApp, appLoading = _c.loading, appError = _c.error;
    // Get the entity from the server
    var _d = useListEntity({
        entityNamespace: entityInfo.namespace.toRaw(),
        data: {},
    }), resp = _d.resp, error = _d.error, loading = _d.loading, fetchDone = _d.fetchDone, fetch = _d.fetch;
    // For pagination - using a fixed value for now since response structure might vary
    var _e = useMemo(function () {
        var currentPage = 1;
        // Since we don't know the exact response structure, using a fixed value of pages
        var totalPages = 1;
        return [currentPage, function (newPage) {
                // In a real application, this would trigger a new fetch with pagination parameters
                console.log("Changing to page ".concat(newPage));
                // fetch({ page: newPage })
            }];
    }, []), page = _e[0], setPage = _e[1];
    // Handle row click to navigate to entity detail
    var handleRowClick = function (entity) {
        var path = getEntityDetailPath({ entityInfo: entityInfo, entity: entity });
        router.push(path);
    };
    // Helper to safely access entity properties
    var getEntityProperty = function (entity, prop) {
        if (entity && prop in entity) {
            var value = entity[prop];
            // Format dates nicely
            if (prop === 'createdAt' || prop === 'updatedAt') {
                return dayjs(value).format('MMM D, YYYY h:mm A');
            }
            return String(value);
        }
        return '';
    };
    // Determine which columns to display
    var getColumns = function (entities) {
        if (!entities || entities.length === 0)
            return ['id', 'createdAt', 'updatedAt'];
        var sample = entities[0];
        var columns = ['id'];
        // Add optional columns if they exist
        if ('name' in sample)
            columns.push('name');
        if ('key' in sample)
            columns.push('key');
        if ('status' in sample)
            columns.push('status');
        // Add standard date columns at the end
        columns.push('createdAt', 'updatedAt');
        return columns;
    };
    // Format column headers for display
    var formatColumnName = function (column) {
        switch (column) {
            case 'id': return 'ID';
            case 'createdAt': return 'Created';
            case 'updatedAt': return 'Updated';
            default:
                return column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1');
        }
    };
    // Get entities from the response and ensure it's an array
    var entities = Array.isArray((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.items) ? (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.items : [];
    // Get columns to display
    var columns = getColumns(entities);
    // Render loading state
    if (loading || appLoading) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { style: { padding: '16px' } },
                React.createElement(Card, { shadow: "sm", style: { padding: '16px', borderRadius: '8px', border: '1px solid #eee' } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '32px' } },
                        React.createElement(Loader, { size: "md" }),
                        React.createElement(Text, null, "Loading entities..."))))));
    }
    // Render error state
    if (error || appError) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { style: { padding: '16px' } },
                React.createElement(Card, { shadow: "sm", style: { padding: '16px', borderRadius: '8px', border: '1px solid #eee' } },
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                        React.createElement(Title, { order: 3, style: { color: 'red' } }, "Error"),
                        React.createElement(Text, { style: { color: 'red' } },
                            error ? (typeof error === 'string'
                                ? error
                                : 'Error fetching entities. Please try again.') : '',
                            appError ? (typeof appError === 'string'
                                ? appError
                                : 'Application error. Please try again.') : ''),
                        React.createElement(Button, { onClick: function () { return fetch(); }, style: { marginTop: '16px' } }, "Retry"))))));
    }
    return (React.createElement(SafeMantineProvider, null,
        React.createElement(Container, { style: { padding: '16px' } },
            React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                React.createElement(Card, { shadow: "sm", style: { padding: '16px', borderRadius: '8px', border: '1px solid #eee' } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
                        React.createElement(Title, { order: 2 },
                            entityInfo.getNameFriendly(),
                            " List"),
                        React.createElement("div", { style: { display: 'flex', gap: '8px' } },
                            React.createElement(Button, { style: { display: 'flex', alignItems: 'center', gap: '4px' }, onClick: function () {
                                    // Generate the add path manually since param types might not match
                                    var path = "/svc/".concat(entityInfo.namespace.service, "/ent/").concat(entityInfo.namespace.entity, "/add");
                                    router.push(path);
                                } },
                                React.createElement(MdAdd, { size: 16 }),
                                " Add New"),
                            React.createElement(Button, { variant: "outline", style: { display: 'flex', alignItems: 'center', gap: '4px' }, onClick: function () {
                                    // Generate the chat path manually since param types might not match
                                    var path = "/svc/".concat(entityInfo.namespace.service, "/ent/").concat(entityInfo.namespace.entity, "/chat");
                                    router.push(path);
                                } },
                                React.createElement(MdChat, { size: 16 }),
                                " Chat"))),
                    entities.length === 0 ? (React.createElement(Alert, { color: "blue", title: "No entities found" },
                        "There are no ",
                        entityInfo.getNameFriendly(),
                        " entities available.")) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { style: { overflowX: 'auto' } },
                            React.createElement(Table, { highlightOnHover: true },
                                React.createElement(Table.Thead, null,
                                    React.createElement(Table.Tr, null, columns.map(function (column) { return (React.createElement(Table.Th, { key: column }, formatColumnName(column))); }))),
                                React.createElement(Table.Tbody, null, entities.map(function (entity) { return (React.createElement(Table.Tr, { key: String(entity.id), onClick: function () { return handleRowClick(entity); }, style: { cursor: 'pointer' } }, columns.map(function (column) { return (React.createElement(Table.Td, { key: "".concat(entity.id, "-").concat(column) }, getEntityProperty(entity, column))); }))); })))),
                        React.createElement("div", { style: { display: 'flex', justifyContent: 'center', marginTop: '16px' } },
                            React.createElement(Pagination, { value: page, onChange: setPage, total: 1 })))))))));
};
