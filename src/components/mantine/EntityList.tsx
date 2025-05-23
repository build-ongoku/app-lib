'use client'

import { Anchor, Button, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import 'mantine-react-table/styles.css' //make sure MRT styles were imported in your app root (once)
import React, { useContext, useMemo } from 'react'
import { EntityInfo, IEntityMinimal } from '../../common/app_v3'
import { getEntityAddPath, getEntityChatPath } from '../../components/EntityLink'
import { ListEntityResponseData, useListEntity } from '../../providers/httpV2'
import { ServerResponseWrapper } from './ServerResponseWrapper'
import { pluralize } from '../../common/namespacev2'
import { MdAdd, MdChat } from 'react-icons/md'
import { AppContext } from '../../common/AppContextV3'
import { Router } from '../../common/types'

dayjs.extend(relativeTime)

const getDefaultEntityColumns = <E extends IEntityMinimal>(entityInfo: EntityInfo<E>): MRT_ColumnDef<E>[] => {
    const cols: MRT_ColumnDef<E>[] = []

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    // ID
    cols.push({
        id: 'identifier',
        accessorFn: (row: E) => {
            return entityInfo.getEntityNameFriendly(row)
        },
        header: 'Identifier',
        Cell: ({ cell, row }) => {
            const entity = row.original
            const name = entityInfo.getEntityNameFriendly(entity)
            const id = entity.id
            return (
                <Anchor key={id} href={`${entityInfo.namespace.toURLPath()}/${id}`}>
                    {name}
                </Anchor>
            )
        },
    })

    // If the entity has a status field, add it
    const typeInfo = entityInfo.getTypeInfo(appInfo)
    const statusField = typeInfo.fields.find((f) => f.name.equalString('status'))
    if (statusField) {
        cols.push({
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ cell }) => {
                const value = cell.getValue<string>()
                return <Text>{value}</Text>
            },
        })
    }

    // Created At
    cols.push({
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell: ({ cell }) => {
            const value = cell.getValue<Date>()
            const displayValue = dayjs(value).fromNow()
            return <Text>{displayValue}</Text>
        },
    })

    // Updated At
    cols.push({
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell: ({ cell }) => {
            const value = cell.getValue<Date>()
            const displayValue = dayjs(value).fromNow()
            return <Text>{displayValue}</Text>
        },
    })

    return cols
}

// EntityListTable fetches the list of entities and renders the table
export const EntityListTable = <E extends IEntityMinimal>(props: { 
    entityInfo: EntityInfo<E>
    router: Router
 }) => {
    const { entityInfo, router } = props

    // Get the entity from the server
    const { resp, error, loading, fetchDone, fetch } = useListEntity<E>({
        entityNamespace: entityInfo.namespace.toRaw(),
        data: {},
    })

    return (
        <div>
            <ServerResponseWrapper error={error || resp?.error} loading={loading}>
                <div className="flex justify-between my-5">
                    <Title order={2}>Your {pluralize(entityInfo.getNameFriendly())}</Title>
                    <div className="flex gap-3">

                        <Button
                            leftSection={<MdAdd />}
                            onClick={() => {
                                router.push(getEntityAddPath(entityInfo))
                            }}
                        >
                            Add {entityInfo.getNameFriendly()}
                        </Button>
                        <Button
                            leftSection={<MdChat />}
                            onClick={() => {
                                router.push(getEntityChatPath(entityInfo))
                            }}
                        >
                            Chat
                        </Button>
                    </div>
                </div>
                {resp?.data && <EntityListTableInner entityInfo={entityInfo} data={resp.data} />}
            </ServerResponseWrapper>
        </div>
    )
}

// EntityListTableInner takes the list response and renders the table
export const EntityListTableInner = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; data: ListEntityResponseData<E> }) => {
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
