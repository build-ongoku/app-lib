'use client'

import { EntityInfo, IEntityMinimal } from '../common/app_v3'
import React from 'react'

interface EntityLinkProps<E extends IEntityMinimal> {
    entity: E
    entityInfo: EntityInfo<E>
    text?: JSX.Element
}

export const Link = (props: { to: string; children: React.ReactNode }) => {
    return <a href={props.to}>{props.children}</a>
}

export const EntityLink = <E extends IEntityMinimal>(props: EntityLinkProps<E>): JSX.Element => {
    const { entity, entityInfo, text } = props
    return <Link to={getEntityDetailPath({ entityInfo, entity })}>{text ? text : entityInfo.getEntityNameFriendly(entity)}</Link>
}

export const EntityListLink = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; text?: string }) => {
    const { entityInfo, text } = props
    return <Link to={getEntityListPath(entityInfo)}>{text ? text : entityInfo.getNameFriendly()}</Link>
}

interface EntityAddLinkProps<E extends IEntityMinimal> {
    entityInfo: EntityInfo<E>
    children: React.ReactElement
}

export const EntityAddLink = <E extends IEntityMinimal>(props: EntityAddLinkProps<E>) => {
    return <Link to={getEntityAddPath(props.entityInfo)}>{props.children}</Link>
}

export const getEntityDetailPath = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; entity: E }): string => {
    const { entityInfo, entity } = props
    return entityInfo.namespace.toURLPath() + '/' + entity.id
}

export const getEntityListPath = <E extends IEntityMinimal>(entityInfo: EntityInfo<E>): string => {
    return entityInfo.namespace.toURLPath() + '/list'
}

export const getEntityAddPath = <E extends IEntityMinimal = IEntityMinimal>(entityInfo: EntityInfo<E>): string => {
    return entityInfo.namespace.toURLPath() + '/add'
}

export const getEntityEditPath = <E extends IEntityMinimal = IEntityMinimal>(props: { entityInfo: EntityInfo<E>; entity: E }): string => {
    const { entityInfo, entity } = props
    return entityInfo.namespace.toURLPath() + '/' + entity.id + '/edit'
}

export const getEntityChatPath = <E extends IEntityMinimal = IEntityMinimal>(entityInfo: EntityInfo<E>): string => {
    return entityInfo.namespace.toURLPath() + '/method/chat'
}
