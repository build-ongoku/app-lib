import { AppContext } from '../../common/AppContextV3'
import { IEntityMinimal } from '../../common/app_v3'
import { EntityListTable } from './EntityList'
import React, { useContext } from 'react'

export interface Props {
    params: {
        service: string
        entity: string
    }
}

export const PageEntityList = <E extends IEntityMinimal = any>(props: Props) => {
    const { service: serviceName, entity: entityName } = props.params
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const entityInfo = appInfo.getEntityInfo<E>({ service: serviceName, entity: entityName })
    if (!entityInfo) {
        throw new Error('EntityInfo not found')
    }

    return (
        <div>
            <EntityListTable entityInfo={entityInfo} />
        </div>
    )
}
