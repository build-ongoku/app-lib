import { EntityInfo, EntityMinimal } from '../../common/Entity'
import { ServerResponseWrapper } from './ServerResponseWrapper'
import { ListEntityResponse, useListEntity } from '../../providers/provider'
import { Title } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import 'mantine-react-table/styles.css' //make sure MRT styles were imported in your app root (once)
import { useMemo } from 'react'

dayjs.extend(relativeTime)

const getDefaultEntityColumns = <E extends EntityMinimal>(entityInfo: EntityInfo<E>): MRT_ColumnDef<E>[] => [
    {
        id: 'identifier',
        accessorFn: (row: E) => {
            return entityInfo.getHumanName(row)
        },
        header: 'Identifier',
        Cell: ({ cell, row }) => {
            const entity = row.original
            const name = entityInfo.getHumanName(entity)
            const id = entity.id
            return <a href={`/${entityInfo.serviceName}/${entityInfo.name}/${id}`}>{name}</a>
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        Cell: ({ cell }) => {
            const value = cell.getValue<Date>()
            const displayValue = dayjs(value).fromNow()
            return <span>{displayValue}</span>
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        Cell: ({ cell }) => {
            const value = cell.getValue<Date>()
            const displayValue = dayjs(value).fromNow()
            return <span>{displayValue}</span>
        },
    },
]

// EntityListTable fetches the list of entities and renders the table
export const EntityListTable = <E extends EntityMinimal>(props: { entityInfo: EntityInfo<E> }) => {
    const { entityInfo } = props

    // Get the entity from the server
    const [resp] = useListEntity<E>({
        entityInfo: entityInfo,
        data: {},
    })

    return (
        <div>
            <ServerResponseWrapper error={resp.error} loading={resp.loading}>
                <Title order={2}>Your {entityInfo.getEntityNameFormatted()}</Title>
                {resp.data && <EntityListTableInner entityInfo={entityInfo} data={resp.data} />}
            </ServerResponseWrapper>
        </div>
    )
}

// EntityListTableInner takes the list response and renders the table
export const EntityListTableInner = <E extends EntityMinimal>(props: { entityInfo: EntityInfo<E>; data: ListEntityResponse<E> }) => {
    const cols = getDefaultEntityColumns<E>(props.entityInfo)
    const colsMemo = useMemo<MRT_ColumnDef<E>[]>(() => cols, [])

    const table = useMantineReactTable<E>({
        columns: colsMemo,
        data: props.data.items,
    })

    return <MantineReactTable table={table} />
}
