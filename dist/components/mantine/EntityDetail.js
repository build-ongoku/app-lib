import { Button, ButtonGroup, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AppContext } from '../../common/AppContextV3';
import { Operator } from '../../common/Filter';
import { getEntityAddPath } from '@ongoku/app-lib/src/components/EntityLink';
import { EntityListTableInner } from './EntityList';
import { ServerResponseWrapper } from './ServerResponseWrapper';
import { useGetEntity, useListEntityV2 } from '../../providers/provider';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
export var EntityDetail = function (props) {
    var entityInfo = props.entityInfo, identifier = props.identifier;
    var router = useRouter();
    // Todo: Assume that the identifier is the id for now but this could include any other human readable identifier
    // Fetch the entity from the server
    var _a = useGetEntity({
        entityInfo: entityInfo,
        data: {
            id: identifier,
        },
    }), resp = _a[0], refetch = _a[1];
    return (React.createElement("div", null,
        React.createElement(ServerResponseWrapper, { error: resp.error, loading: resp.loading }, resp.data && (React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement("div", { className: "flex justify-between my-5" },
                React.createElement(Title, { order: 2 }, "".concat(entityInfo.getNameFriendly(), ": ").concat(entityInfo.getEntityNameFriendly(resp.data))),
                React.createElement(Button, { onClick: function () {
                        router.push(getEntityAddPath(entityInfo));
                    } },
                    "Add New ",
                    entityInfo.getNameFriendly())),
            React.createElement(EntityActions, { entityInfo: entityInfo, id: identifier, refetchEntity: refetch }),
            React.createElement("pre", null, JSON.stringify(resp.data, null, 2)),
            React.createElement(EntityAssociations, { entityInfo: entityInfo, entityID: identifier, entityData: resp.data }))))));
};
var EntityAssociations = function (props) {
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var items = props.entityInfo.associations.map(function (assoc) {
        return React.createElement(EntityAssociationGeneric, { key: assoc.name.toRaw(), entityInfo: props.entityInfo, assoc: assoc, entityID: props.entityID, entityData: props.entityData });
    });
    return React.createElement("div", { className: "flex flex-col gap-10" }, items);
};
var EntityAssociationGeneric = function (props) {
    var assoc = props.assoc, entityInfo = props.entityInfo, entityID = props.entityID, entityData = props.entityData;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    // Get the other entity info
    var otherEntityInfo = appInfo.getEntityInfo(assoc.entityNamespace.toRaw());
    if (!otherEntityInfo) {
        var errMsg = '[EntityDetail] [EntityAssociationGeneric] Corresponding entity not found';
        console.error(errMsg, 'namespace', assoc.entityNamespace);
        throw new Error(errMsg);
    }
    if (assoc.relationship === 'parent_of') {
        return React.createElement(EntityAssociationChildren, { entityInfo: entityInfo, assoc: assoc, entityID: entityID, otherEntityInfo: otherEntityInfo });
    }
    if (assoc.relationship === 'child_of') {
        // If an entity is a child, the parent ID is stored in the entity itself
        return React.createElement(EntityAssociationParents, { entityInfo: entityInfo, assoc: assoc, entityID: entityID, entityData: entityData, otherEntityInfo: otherEntityInfo });
    }
    console.warn('[EntityDetail] [EntityAssociationGeneric] Association type is not yet implemented', 'relationship', assoc.relationship);
};
var EntityAssociationChildren = function (props) {
    var _a;
    var _b;
    var entityInfo = props.entityInfo, entityID = props.entityID, assoc = props.assoc, otherEntityInfo = props.otherEntityInfo;
    // From the entity, get the corresponding other association.
    var otherAssoc = otherEntityInfo.associations.find(function (a) {
        console.log('[EntityDetail] [EntityAssociationGeneric] Finding matching association in corresponding entity');
        var expectedRelationship = assoc.relationship === 'parent_of' ? 'child_of' : assoc.relationship === 'child_of' ? 'parent_of' : undefined;
        if (!expectedRelationship) {
            throw new Error('Could not determine the expected relationship of the corresponding entity association');
        }
        return a.relationship === expectedRelationship && a.entityNamespace.equal(props.entityInfo.namespace) && assoc.otherAssociationName && a.name.equal(assoc.otherAssociationName);
    });
    if (!otherAssoc) {
        var errMsg = '[EntityDetail] [EntityAssociationGeneric] Corresponding association not found';
        console.error(errMsg, 'name', (_b = assoc.otherAssociationName) === null || _b === void 0 ? void 0 : _b.toRaw());
        throw new Error(errMsg);
    }
    // From the other association, get the field name of the other entity that links to this entity
    // otherEntityFieldName should of type keyof E2
    // const otherEntityFieldName = otherAssoc.name.toFieldName() as keyof E2
    var otherEntityFilterFieldName = (assoc.type === 'many' ? 'having' + otherAssoc.toFieldName().toPascal() : otherAssoc.toFieldName().toFieldName());
    console.debug('[EntityDetail] [EntityAssociationGeneric] Field name for corresponding entity found:', otherEntityFilterFieldName);
    var _c = useListEntityV2({
        entityInfo: otherEntityInfo,
        data: {
            filter: (_a = {},
                _a[otherEntityFilterFieldName] = {
                    op: Operator.EQUAL,
                    values: [entityID],
                },
                _a),
        },
    }), resp = _c[0], loading = _c[1];
    return (React.createElement(ServerResponseWrapper, { error: resp === null || resp === void 0 ? void 0 : resp.error, loading: loading }, (resp === null || resp === void 0 ? void 0 : resp.data) && (React.createElement("div", null,
        React.createElement(Title, { order: 3 }, assoc.name.toCapital()),
        React.createElement(EntityListTableInner, { entityInfo: otherEntityInfo, data: resp.data })))));
};
var EntityAssociationParents = function (props) {
    var assoc = props.assoc, otherEntityInfo = props.otherEntityInfo, entityID = props.entityID, entityData = props.entityData;
    // The parents don't know about their children. So we need to fetch the parent entity by their IDs. Those IDs are stored in the entity itself
    var assocFieldName = (assoc.type === 'many' ? assoc.name.append('ids').toCamel() : assoc.name.append('id').toCamel());
    // The ID could be a single ID or an array of IDs
    var parentIDs = entityData[assocFieldName];
    if (!parentIDs) {
        console.error('[EntityDetail] [EntityAssociationParents] Parent IDs not found', 'fieldName', assocFieldName);
        return null;
    }
    // If the parent IDs are an array, we need to fetch all the parents
    var values = Array.isArray(parentIDs) ? parentIDs : [parentIDs];
    var _a = useListEntityV2({
        entityInfo: otherEntityInfo,
        data: {
            filter: {
                id: {
                    op: Operator.IN,
                    values: values,
                },
            },
        },
    }), resp = _a[0], loading = _a[1];
    return (React.createElement(ServerResponseWrapper, { error: resp === null || resp === void 0 ? void 0 : resp.error, loading: loading }, (resp === null || resp === void 0 ? void 0 : resp.data) && (React.createElement("div", null,
        React.createElement(Title, { order: 3 }, assoc.name.toCapital()),
        React.createElement(EntityListTableInner, { entityInfo: otherEntityInfo, data: resp.data })))));
};
var EntityActions = function (props) {
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    // For all the actions of the entity, add a button to call the method
    var actions = props.entityInfo.actions;
    console.log('[EntityDetail] Entity Actions', actions);
    var actionButtons = actions.map(function (action) {
        // Get the method
        var mthdNs = action.methodNamespace;
        var method = appInfo.getMethod(mthdNs.toRaw());
        if (!method) {
            console.error('[EntityDetail] [EntityActions] Method not found', 'namespace', action.methodNamespace);
            throw new Error('Method not found');
        }
        return (React.createElement(Button, { key: action.name.toRaw(), onClick: function () {
                console.log('[EntityDetail] [EntityActions] [Button] Calling action', 'action', action.name.toRaw());
                method
                    .makeAPIRequest({
                    ID: props.id,
                })
                    .then(function (resp) {
                    console.log('[EntityDetail] [EntityActions] [Button] [Response]', 'data', resp.data);
                    // refresh the page only if the action is successful
                    if (resp.error) {
                        console.error('[EntityDetail] [EntityActions] [Button] [Response] Error', 'error', resp.error);
                        notifications.show({
                            title: "".concat(action.name.toCapital(), " Action: Failed"),
                            message: resp.error,
                            color: 'red',
                            position: 'bottom-right',
                        });
                        return;
                    }
                    notifications.show({
                        title: "".concat(action.name.toCapital(), " Action: Result"),
                        message: React.createElement("pre", null, JSON.stringify(resp.data, null, 2)),
                        position: 'bottom-right',
                    });
                    props.refetchEntity({});
                });
            } }, action.name.toCapital()));
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(ButtonGroup, null, actionButtons)));
};
