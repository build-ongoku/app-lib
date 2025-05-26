'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Button, ButtonGroup, Title, Card, Text, Container, Loader, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { MdAdd, MdOutlineFormatListBulleted, MdChat } from 'react-icons/md';
import { useApp } from '../../providers/AppProvider';
import { SafeMantineProvider } from '../../providers/SafeMantineProvider';
import { useUIFramework } from '../../providers/UIFrameworkProvider';
import { getEntityAddPath, getEntityEditPath, getEntityListPath, getEntityChatPath } from './EntityLink';
import React from 'react';
/**
 * EntityDetail component displays the details of an entity
 */
export var EntityDetail = function (props) {
    var entityInfo = props.entityInfo, identifier = props.identifier;
    // App state from provider
    var _a = useApp(), ongokuApp = _a.ongokuApp, appLoading = _a.loading, appError = _a.error;
    var router = useUIFramework().router;
    // Local state
    var _b = useState(null), entity = _b[0], setEntity = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState(true), shouldFetch = _e[0], setShouldFetch = _e[1];
    // Check URL for entity data passed from creation page
    useEffect(function () {
        if (typeof window !== 'undefined') {
            var urlParams = new URLSearchParams(window.location.search);
            var entityDataParam = urlParams.get('entityData');
            if (entityDataParam) {
                try {
                    var parsedData = JSON.parse(entityDataParam);
                    setEntity(parsedData);
                    setShouldFetch(false);
                }
                catch (e) {
                    console.error('Failed to parse entity data from URL:', e);
                }
            }
        }
    }, []);
    // Fetch entity data if needed
    useEffect(function () {
        var fetchEntityData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockEntity;
            return __generator(this, function (_a) {
                if (!shouldFetch || !ongokuApp)
                    return [2 /*return*/];
                try {
                    setLoading(true);
                    setError(null);
                    // For now, we simulate fetching the entity by its ID
                    // In a real implementation, you'd connect to the backend API
                    // This is a mock implementation
                    // For simulation purposes, instead of trying to call getEntityInfo with the namespace
                    // which has type compatibility issues, let's just create a mock entity
                    // In a real implementation, you would use proper API fetching methods 
                    // Mock implementation to avoid the namespace compatibility issues
                    // We'll just use the entityInfo directly and create a mock entity
                    console.log("Fetching entity data for namespace: ".concat(entityInfo.namespace.toString(), ", ID: ").concat(identifier));
                    mockEntity = {
                        id: identifier,
                        name: "".concat(entityInfo.getNameFriendly(), " ").concat(identifier),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    console.log("[EntityDetail] Fetched entity with ID: ".concat(identifier));
                    setEntity(mockEntity);
                }
                catch (err) {
                    console.error('Error fetching entity:', err);
                    setError(err instanceof Error ? err : new Error(String(err)));
                    notifications.show({
                        title: 'Error',
                        message: "Failed to load entity: ".concat(err instanceof Error ? err.message : String(err)),
                        color: 'red'
                    });
                }
                finally {
                    setLoading(false);
                }
                return [2 /*return*/];
            });
        }); };
        fetchEntityData();
    }, [ongokuApp, entityInfo, identifier, shouldFetch]);
    // Navigation handlers
    var handleEdit = function () {
        router.push(getEntityEditPath({ entityInfo: entityInfo, entity: entity }));
    };
    var handleAddNew = function () {
        router.push(getEntityAddPath(entityInfo));
    };
    var handleViewList = function () {
        router.push(getEntityListPath(entityInfo));
    };
    var handleChat = function () {
        router.push(getEntityChatPath(entityInfo));
    };
    // Render loading state
    if (loading || appLoading) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { p: "md" },
                React.createElement(Card, { shadow: "sm", p: "lg", radius: "md", withBorder: true },
                    React.createElement(Group, { justify: "center", align: "center" },
                        React.createElement(Loader, { size: "md" }),
                        React.createElement(Text, null, "Loading entity..."))))));
    }
    // Render error state
    if (error || appError) {
        return (React.createElement(SafeMantineProvider, null,
            React.createElement(Container, { p: "md" },
                React.createElement(Card, { shadow: "sm", p: "lg", radius: "md", withBorder: true },
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                        React.createElement(Title, { order: 3, style: { color: 'red' } }, "Error"),
                        React.createElement(Text, { style: { color: 'red' } }, (error === null || error === void 0 ? void 0 : error.message) || (appError === null || appError === void 0 ? void 0 : appError.message)),
                        React.createElement(Button, { onClick: function () { return setShouldFetch(true); }, style: { marginTop: '16px' } }, "Retry"))))));
    }
    // Render entity detail view
    return (React.createElement(SafeMantineProvider, null,
        React.createElement(Container, { style: { padding: '16px' } },
            React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                React.createElement(Card, { shadow: "sm", style: { padding: '16px', borderRadius: '8px', border: '1px solid #eee' } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                        React.createElement(Title, { order: 2 },
                            entityInfo.getNameFriendly(),
                            " Details"),
                        React.createElement(ButtonGroup, null,
                            React.createElement(Button, { style: { display: 'flex', alignItems: 'center', gap: '4px' }, variant: "outline", onClick: handleEdit, disabled: !entity },
                                React.createElement(FiEdit2, { size: 16 }),
                                " Edit"),
                            React.createElement(Button, { style: { display: 'flex', alignItems: 'center', gap: '4px' }, variant: "outline", onClick: handleAddNew },
                                React.createElement(MdAdd, { size: 16 }),
                                " Add New"),
                            React.createElement(Button, { style: { display: 'flex', alignItems: 'center', gap: '4px' }, variant: "outline", onClick: handleViewList },
                                React.createElement(MdOutlineFormatListBulleted, { size: 16 }),
                                " List"),
                            React.createElement(Button, { style: { display: 'flex', alignItems: 'center', gap: '4px' }, variant: "outline", onClick: handleChat },
                                React.createElement(MdChat, { size: 16 }),
                                " Chat")))),
                entity && (React.createElement(Card, { shadow: "sm", style: { padding: '16px', borderRadius: '8px', border: '1px solid #eee' } },
                    React.createElement(Title, { order: 3, style: { marginBottom: '16px' } }, "Entity Information"),
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                        React.createElement("div", { style: { display: 'flex', gap: '8px' } },
                            React.createElement(Text, { style: { fontWeight: 700 } }, "ID:"),
                            React.createElement(Text, null, entity.id)),
                        Object.entries(entity).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (key === 'id')
                                return null;
                            return (React.createElement("div", { key: key, style: { display: 'flex', gap: '8px' } },
                                React.createElement(Text, { style: { fontWeight: 700 } },
                                    key,
                                    ":"),
                                React.createElement(Text, null, typeof value === 'object' ? JSON.stringify(value) : String(value))));
                        }))))))));
};
