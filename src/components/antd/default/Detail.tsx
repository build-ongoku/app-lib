import { Card, Result, Spin } from 'antd'
import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { UUID } from '@ongoku/app-lib/src/common/Primitives'

import React from 'react'

import { TypeDisplay } from '@ongoku/app-lib/src/components/DisplayAttributes/DisplayAttributes'
import { useGetEntity } from '@ongoku/app-lib/src/providers/provider'

interface Props<E extends EntityMinimal = any> {
    entityInfo: EntityInfo<E>
    objectId: UUID
}

export const DefaultDetailView = <E extends EntityMinimal = any>(props: Props<E>) => {
    const { entityInfo, objectId } = props

    const [{ loading, error, data: entity }] = useGetEntity<E>({ entityInfo: entityInfo, params: { id: objectId } })

    if (loading) {
        return <Spin size="large" />
    }

    if (error) {
        return <Result status="error" title="Something went wrong" subTitle={error} />
    }

    if (!entity) {
        return <Result status="error" subTitle="No entity data returned" />
    }

    // Otherwise return a Table view
    return (
        <Card title={entityInfo.getNameFormatted() + ': ' + entityInfo.getHumanName(entity)}>
            <TypeDisplay typeInfo={entityInfo} objectValue={entity} />
        </Card>
    )
}
