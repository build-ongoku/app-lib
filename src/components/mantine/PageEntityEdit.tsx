'use client'

import { Title } from '@mantine/core'
import { IEntityMinimal } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { EntityEditForm } from './EntityEdit'
import { WithRouter } from '../../common/types'
import React, { useContext } from 'react'

export interface Props {
    params: {
        service: string
        entity: string
        identifier: string
    }
}

export const PageEntityEdit = <E extends IEntityMinimal = any>(props: Props & WithRouter) => {
    const { router } = props
    const { service: serviceName, entity: entityName, identifier } = props.params

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const entityInfo = appInfo.getEntityInfo<E>({ service: serviceName, entity: entityName })
    if (!entityInfo) {
        throw new Error('EntityInfo not found')
    }

    // Get TypeInfo
    const typeNs = entityInfo.getTypeNamespace()
    const typeInfo = appInfo.getTypeInfo<E>(typeNs.toRaw())
    if (!typeInfo) {
        console.error('[Page] [Add] TypeInfo not found', 'typeNs', typeNs)
        throw new Error('TypeInfo not found for ' + typeNs)
    }

    return (
        <div>
            <Title order={1}>Edit {entityInfo?.getNameFriendly()}</Title>
            <EntityEditForm<E> entityInfo={entityInfo} objectId={identifier} router={router} />
        </div>
    )
}
