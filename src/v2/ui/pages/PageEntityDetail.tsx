'use client'

import { useApp } from '../../providers/AppProvider'
import { IEntityMinimal } from '../../core'
import { EntityDetail } from '../components/EntityDetail'
import React from 'react'

export interface PageEntityDetailProps {
    params: {
        serviceSlug: string
        entitySlug: string
        entityIdentifier: string
    }
}

export const PageEntityDetail = <E extends IEntityMinimal = any>(props: PageEntityDetailProps) => {
    const { serviceSlug, entitySlug, entityIdentifier } = props.params
    
    const { ongokuApp } = useApp()
    if (!ongokuApp) {
        throw new Error('AppInfo not loaded')
    }

    const entityInfo = ongokuApp.getEntityInfo<E>({ service: serviceSlug, entity: entitySlug })
    if (!entityInfo) {
        throw new Error('EntityInfo not found')
    }

    return (
        <>
            <EntityDetail entityInfo={entityInfo} identifier={entityIdentifier} />
        </>
    )
}
