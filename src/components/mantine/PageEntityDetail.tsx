'use client'

import { AppContext } from '../../common/AppContextV3'
import { IEntityMinimal } from '../../common/app_v3'
import { EntityDetail } from './EntityDetail'
import { WithRouter } from '../../common/types'
import React, { useContext } from 'react'

export interface Props {
    params: {
        service: string
        entity: string
        identifier: string
    }
}

export const PageEntityDetail = <E extends IEntityMinimal = any>(props: Props & WithRouter) => {
    const { router } = props
    const { service: serviceName, entity: entityName } = props.params
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const entityInfo = appInfo.getEntityInfo<E>({ service: serviceName, entity: entityName })
    if (!entityInfo) {
        throw new Error('EntityInfo not found')
    }

    // Get the entity from the server
    const { identifier } = props.params

    return (
        <>
            <EntityDetail entityInfo={entityInfo} identifier={identifier} router={router} />
        </>
    )
}
