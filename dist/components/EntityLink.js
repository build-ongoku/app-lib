import React__default from 'react';

var Link = function (props) {
    return React__default.createElement("a", { href: props.to }, props.children);
};
var EntityLink = function (props) {
    var entity = props.entity, entityInfo = props.entityInfo, text = props.text;
    return React__default.createElement(Link, { to: getEntityDetailPath({ entityInfo: entityInfo, entity: entity }) }, text ? text : entityInfo.getEntityNameFriendly(entity));
};
var EntityListLink = function (props) {
    var entityInfo = props.entityInfo, text = props.text;
    return React__default.createElement(Link, { to: getEntityListPath(entityInfo) }, text ? text : entityInfo.getNameFriendly());
};
var EntityAddLink = function (props) {
    return React__default.createElement(Link, { to: getEntityAddPath(props.entityInfo) }, props.children);
};
var getEntityDetailPath = function (props) {
    var entityInfo = props.entityInfo, entity = props.entity;
    return entityInfo.namespace.toURLPath() + '/' + entity.id;
};
var getEntityListPath = function (entityInfo) {
    return entityInfo.namespace.toURLPath() + '/list';
};
var getEntityAddPath = function (entityInfo) {
    return entityInfo.namespace.toURLPath() + '/add';
};

export { EntityAddLink, EntityLink, EntityListLink, Link, getEntityAddPath, getEntityDetailPath, getEntityListPath };
