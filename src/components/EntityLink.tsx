import { EntityInfo, EntityInfoCommon } from '@/common/Entity'
import { EntityInfoCommonV2, EntityMinimal, EntityProps } from '@/common/Entity'
import { TypeInfoCommon } from '@/common/Type'
import React from 'react'
import { capitalCase } from 'change-case'

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

export const EntityListLink = (props: { entityInfo: EntityInfoCommon; text?: string }) => {
    const { entityInfo, text } = props
    return <Link to={getEntityListPath(entityInfo)}>{text ? text : capitalCase(entityInfo.name)}</Link>
}

interface EntityAddLinkProps<E extends EntityMinimal> {
    entityInfo: EntityInfoCommonV2<E>
    children: React.ReactElement
}

export const EntityAddLink = <E extends EntityMinimal>(props: EntityAddLinkProps<E>) => {
    return <Link to={getEntityAddPath(props.entityInfo)}>{props.children}</Link>
}

export const getEntityDetailPath = <E extends EntityMinimal, UTI extends TypeInfoCommon>({ entityInfo, entity }: EntityProps<E, UTI>): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/' + entity.id
}

export const getEntityListPath = (entityInfo: EntityInfoCommon): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/list'
}

export const getEntityAddPath = (entityInfo: EntityInfoCommon): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/add'
}
