'use client';
import React from 'react';
export var Link = function (props) {
    return React.createElement("a", { href: props.to }, props.children);
};
export var EntityLink = function (props) {
    var entity = props.entity, entityInfo = props.entityInfo, text = props.text;
    return React.createElement(Link, { to: getEntityDetailPath({ entityInfo: entityInfo, entity: entity }) }, text ? text : entityInfo.getEntityNameFriendly(entity));
};
export var EntityListLink = function (props) {
    var entityInfo = props.entityInfo, text = props.text;
    return React.createElement(Link, { to: getEntityListPath(entityInfo) }, text ? text : entityInfo.getNameFriendly());
};
export var EntityAddLink = function (props) {
    return React.createElement(Link, { to: getEntityAddPath(props.entityInfo) }, props.children);
};
export var getEntityDetailPath = function (props) {
    var entityInfo = props.entityInfo, entity = props.entity;
    return entityInfo.namespace.toURLPath() + '/' + entity.id;
};
export var getEntityListPath = function (entityInfo) {
    return entityInfo.namespace.toURLPath() + '/list';
};
export var getEntityAddPath = function (entityInfo) {
    return entityInfo.namespace.toURLPath() + '/add';
};
export var getEntityEditPath = function (props) {
    var entityInfo = props.entityInfo, entity = props.entity;
    return entityInfo.namespace.toURLPath() + '/' + entity.id + '/edit';
};
export var getEntityChatPath = function (entityInfo) {
    return entityInfo.namespace.toURLPath() + '/method/chat';
};
