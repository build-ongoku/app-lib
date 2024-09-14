import { Button, Card, Result, Spin } from 'antd'
import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { EntityAddLink } from '@ongoku/app-lib/src/components/EntityLink'
import { useListEntity } from '@ongoku/app-lib/src/providers/provider'
import React from 'react'
import Table, { ColumnProps } from 'antd/lib/table/'

import { PlusOutlined } from '@ant-design/icons'
import { capitalCase } from 'change-case'
import { getFieldForFieldKind } from '../Field'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
}

export const DefaultListView = <E extends EntityMinimal, EFilter>({ entityInfo }: Props<E>) => {
    console.log('List View: Rendering...', 'EntityInfo', entityInfo.name)

    const [resp] = useListEntity<E, EFilter>({
        entityInfo: entityInfo,
        params: {
            req: {},
        },
    })

    console.log('List View: states', resp)

    if (resp.loading) {
        return <Spin size="large" />
    }

    if (resp.error) {
        return <Result status="error" title="Something went wrong" subTitle={resp.error} />
    }

    if (!resp.data) {
        return <Result status="error" subTitle="Panic! No entity data returned" />
    }

    // Otherwise return a Table view
    console.log('* entityInfo.name: ', entityInfo.name)
    console.log('Columns', entityInfo.columnsFieldsForListView)

    const columns: ColumnProps<E>[] = entityInfo.columnsFieldsForListView.map((fieldName) => {
        const fieldInfo = entityInfo.getFieldInfo(fieldName)
        if (!fieldInfo) {
            throw new Error(`Attempted to fetch list column field '${String(fieldName)}' for entity '${entityInfo.name}'`)
        }
        const fieldKind = fieldInfo?.kind
        const fieldComponent = getFieldForFieldKind(fieldKind)
        console.log('* FieldName:', fieldName, 'FieldKind: ', fieldKind.name)
        const DisplayComponent = fieldComponent.getDisplayComponent(fieldInfo, entityInfo)

        return {
            title: fieldComponent.getLabel(fieldInfo),
            dataIndex: fieldName as string,
            render: (value: any, entity: E) => {
                console.log('List: Col: Entity ', entity, 'FieldInfo', fieldInfo)
                return <DisplayComponent value={value} />
            },
        }
    })

    const addButton = (
        <EntityAddLink entityInfo={entityInfo}>
            <Button type="primary" icon={<PlusOutlined />}>
                Add {capitalCase(entityInfo.getEntityName())}
            </Button>
        </EntityAddLink>
    )

    return (
        <Card title={`List ${capitalCase(entityInfo.getEntityName())}`} extra={addButton}>
            <Table columns={columns} dataSource={resp.data?.items} rowKey={(record: E) => record.id} />
        </Card>
    )
}
