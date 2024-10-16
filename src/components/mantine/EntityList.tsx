import { ServerResponseWrapper } from './ServerResponseWrapper'
import { ListEntityResponse, useListEntity } from '../../providers/provider'
import { Button, Title } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import 'mantine-react-table/styles.css' //make sure MRT styles were imported in your app root (once)
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getEntityAddPath } from '@ongoku/app-lib/src/components/EntityLink'
import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'

dayjs.extend(relativeTime)

const getDefaultEntityColumns = <E extends IEntityMinimal>(entityInfo: EntityInfo<E>): MRT_ColumnDef<E>[] => [
    {
        id: 'identifier',
        accessorFn: (row: E) => {
            return entityInfo.getEntityNameFriendly(row)
        },
        header: 'Identifier',
        Cell: ({ cell, row }) => {
            const entity = row.original
            const name = entityInfo.getEntityNameFriendly(entity)
            const id = entity.id
            return <a href={`${entityInfo.namespace.toURLPath()}/${id}`}>{name}</a>
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell: ({ cell }) => {
            const value = cell.getValue<Date>()
            const displayValue = dayjs(value).fromNow()
            return <span>{displayValue}</span>
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell: ({ cell }) => {
            const value = cell.getValue<Date>()
            const displayValue = dayjs(value).fromNow()
            return <span>{displayValue}</span>
        },
    },
]

// EntityListTable fetches the list of entities and renders the table
export const EntityListTable = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E> }) => {
    const { entityInfo } = props
    const router = useRouter()

    // Get the entity from the server
    const [resp] = useListEntity<E>({
        entityInfo: entityInfo,
        data: {},
    })

    return (
        <div>
            <ServerResponseWrapper error={resp.error} loading={resp.loading}>
                <div className="flex justify-between my-5">
                    <Title order={2}>Your {entityInfo.getNameFriendly()}</Title>
                    <Button
                        onClick={() => {
                            router.push(getEntityAddPath(entityInfo))
                        }}
                    >
                        Add {entityInfo.getNameFriendly()}
                    </Button>
                </div>
                {resp.data && <EntityListTableInner entityInfo={entityInfo} data={resp.data} />}
            </ServerResponseWrapper>
        </div>
    )
}

// EntityListTableInner takes the list response and renders the table
export const EntityListTableInner = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; data: ListEntityResponse<E> }) => {
    const cols = getDefaultEntityColumns<E>(props.entityInfo)
    const colsMemo = useMemo<MRT_ColumnDef<E>[]>(() => cols, [])

    const fancyTable = props.data?.items?.length > 10

    const table = useMantineReactTable<E>({
        columns: colsMemo,
        data: props.data.items ?? [],
        enableColumnActions: fancyTable,
        enableColumnFilters: fancyTable,
        enablePagination: fancyTable,
        enableSorting: fancyTable,
        mantineTableProps: {
            withColumnBorders: false,
        },
    })

    return <MantineReactTable table={table} />
}
