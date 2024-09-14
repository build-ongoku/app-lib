import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { capitalCase } from 'change-case'
import React from 'react'

interface EntityLinkProps<E extends EntityMinimal> {
    entity: E
    entityInfo: EntityInfo<E>
    text?: JSX.Element
}

export const Link = (props: { to: string; children: React.ReactNode }) => {
    return <a href={props.to}>{props.children}</a>
}

export const EntityLink = <E extends EntityMinimal>(props: EntityLinkProps<E>): JSX.Element => {
    const { entity, entityInfo, text } = props
    return <Link to={getEntityDetailPath({ entityInfo, entity })}>{text ? text : entityInfo.getHumanName(entity)}</Link>
}

export const EntityListLink = <E extends EntityMinimal>(props: { entityInfo: EntityInfo<E>; text?: string }) => {
    const { entityInfo, text } = props
    return <Link to={getEntityListPath(entityInfo)}>{text ? text : capitalCase(entityInfo.name)}</Link>
}

interface EntityAddLinkProps<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
    children: React.ReactElement
}

export const EntityAddLink = <E extends EntityMinimal>(props: EntityAddLinkProps<E>) => {
    return <Link to={getEntityAddPath(props.entityInfo)}>{props.children}</Link>
}

export const getEntityDetailPath = <E extends EntityMinimal>(props: { entityInfo: EntityInfo<E>; entity: E }): string => {
    const { entityInfo, entity } = props
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/' + entity.id
}

export const getEntityListPath = <E extends EntityMinimal>(entityInfo: EntityInfo<E>): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/list'
}

export const getEntityAddPath = <E extends EntityMinimal>(entityInfo: EntityInfo<E>): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/add'
}
