'use client'

import React from 'react'
import { useApp } from '../../providers/AppProvider'
import { IEntityMinimal } from '../../core'
import { EntityList } from '../components/EntityList'
import { usePromiseValue } from '../../utils/index-client'

export interface PageEntityListProps {
    params: Promise<{ serviceSlug: string, entitySlug: string }>
}

export const PageEntityList = <E extends IEntityMinimal = any>(props: PageEntityListProps) => {
    
    const { value: params, isLoading: isLoadingParams, error: errorParams } = usePromiseValue(props.params, { serviceSlug: '', entitySlug: '' })
    
    const { ongokuApp, loading: isLoadingApp, error: errorApp } = useApp()

    if (isLoadingParams || isLoadingApp) {
        return <div>Loading...</div>
    }
    if (errorParams || errorApp) {
        return <div>Error: {errorParams?.message || errorApp?.message}</div>
    }

    if (!ongokuApp) {
        throw new Error('AppInfo not loaded')
    }

    const entityInfo = ongokuApp.getEntityInfo<E>({ service: params.serviceSlug, entity: params.entitySlug })
    if (!entityInfo) {
        throw new Error('EntityInfo not found')
    }

    return (
        <>
            <EntityList entityInfo={entityInfo} />
        </>
    )
}
