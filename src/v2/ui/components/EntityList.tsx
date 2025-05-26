'use client'

import React from 'react'
import { Button, Text, Title, Table, Card, Container, Pagination, Alert, Loader } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMemo } from 'react'
import { EntityInfo, IEntityMinimal } from '../../core'
import { getEntityDetailPath } from './EntityLink'
import { useListEntity } from '../../utils/index-client'
import { MdAdd, MdChat } from 'react-icons/md'
import { useApp } from '../../providers/AppProvider'
import { SafeMantineProvider } from '../../providers/SafeMantineProvider'
import { useUIFramework } from '../../providers/UIFrameworkProvider'

dayjs.extend(relativeTime)

export const EntityList = <E extends IEntityMinimal>(props: { 
    entityInfo: EntityInfo<E>
 }) => {
    const { entityInfo } = props
    const { router } = useUIFramework()
    const { ongokuApp, loading: appLoading, error: appError } = useApp()
    
    // Get the entity from the server
    const { resp, error, loading, fetchDone, fetch } = useListEntity<E>({
        entityNamespace: entityInfo.namespace.toRaw(),
        data: {},
    })
    
    // For pagination - using a fixed value for now since response structure might vary
    const [page, setPage] = useMemo(() => {
        const currentPage = 1
        // Since we don't know the exact response structure, using a fixed value of pages
        const totalPages = 1
        return [currentPage, (newPage: number) => {
            // In a real application, this would trigger a new fetch with pagination parameters
            console.log(`Changing to page ${newPage}`)
            // fetch({ page: newPage })
        }]
    }, [])
    
    // Handle row click to navigate to entity detail
    const handleRowClick = (entity: E) => {
        const path = getEntityDetailPath({ entityInfo, entity })
        router.push(path)
    }
    
    // Helper to safely access entity properties
    const getEntityProperty = (entity: any, prop: string): string => {
        if (entity && prop in entity) {
            const value = entity[prop]
            
            // Format dates nicely
            if (prop === 'createdAt' || prop === 'updatedAt') {
                return dayjs(value).format('MMM D, YYYY h:mm A')
            }
            
            return String(value)
        }
        return ''
    }
    
    // Determine which columns to display
    const getColumns = (entities: E[]): string[] => {
        if (!entities || entities.length === 0) return ['id', 'createdAt', 'updatedAt']
        
        const sample = entities[0] as any
        const columns = ['id']
        
        // Add optional columns if they exist
        if ('name' in sample) columns.push('name')
        if ('key' in sample) columns.push('key')
        if ('status' in sample) columns.push('status')
        
        // Add standard date columns at the end
        columns.push('createdAt', 'updatedAt')
        
        return columns
    }
    
    // Format column headers for display
    const formatColumnName = (column: string): string => {
        switch (column) {
            case 'id': return 'ID'
            case 'createdAt': return 'Created'
            case 'updatedAt': return 'Updated'
            default:
                return column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')
        }
    }
    
    // Get entities from the response and ensure it's an array
    const entities: E[] = Array.isArray(resp?.data?.items) ? resp?.data?.items : []
    
    // Get columns to display
    const columns = getColumns(entities)
    
    // Render loading state
    if (loading || appLoading) {
        return (
            <SafeMantineProvider>
                <Container style={{ padding: '16px' }}>
                    <Card shadow="sm" style={{ padding: '16px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '32px' }}>
                            <Loader size="md" />
                            <Text>Loading entities...</Text>
                        </div>
                    </Card>
                </Container>
            </SafeMantineProvider>
        )
    }
    
    // Render error state
    if (error || appError) {
        return (
            <SafeMantineProvider>
                <Container style={{ padding: '16px' }}>
                    <Card shadow="sm" style={{ padding: '16px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Title order={3} style={{ color: 'red' }}>Error</Title>
                            <Text style={{ color: 'red' }}>
                                {error ? (typeof error === 'string' 
                                    ? error 
                                    : 'Error fetching entities. Please try again.') : ''}
                                {appError ? (typeof appError === 'string' 
                                    ? appError 
                                    : 'Application error. Please try again.') : ''}
                            </Text>
                            <Button onClick={() => fetch()} style={{ marginTop: '16px' }}>Retry</Button>
                        </div>
                    </Card>
                </Container>
            </SafeMantineProvider>
        )
    }
    
    return (
        <SafeMantineProvider>
            <Container style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Header section with title and actions */}
                    <Card shadow="sm" style={{ padding: '16px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <Title order={2}>{entityInfo.getNameFriendly()} List</Title>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => {
                                        // Generate the add path manually since param types might not match
                                        const path = `/svc/${entityInfo.namespace.service}/ent/${entityInfo.namespace.entity}/add`
                                        router.push(path)
                                    }}
                                >
                                    <MdAdd size={16} /> Add New
                                </Button>
                                <Button
                                    variant="outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => {
                                        // Generate the chat path manually since param types might not match
                                        const path = `/svc/${entityInfo.namespace.service}/ent/${entityInfo.namespace.entity}/chat`
                                        router.push(path)
                                    }}
                                >
                                    <MdChat size={16} /> Chat
                                </Button>
                            </div>
                        </div>
                        
                        {/* Entity list table */}
                        {entities.length === 0 ? (
                            <Alert color="blue" title="No entities found">
                                There are no {entityInfo.getNameFriendly()} entities available.
                            </Alert>
                        ) : (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <Table highlightOnHover>
                                        <Table.Thead>
                                            <Table.Tr>
                                                {columns.map(column => (
                                                    <Table.Th key={column}>{formatColumnName(column)}</Table.Th>
                                                ))}
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {entities.map(entity => (
                                                <Table.Tr 
                                                    key={String(entity.id)} 
                                                    onClick={() => handleRowClick(entity)} 
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {columns.map(column => (
                                                        <Table.Td key={`${entity.id}-${column}`}>
                                                            {getEntityProperty(entity, column)}
                                                        </Table.Td>
                                                    ))}
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </div>
                                
                                {/* Pagination - hardcoded to one page for now */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                    <Pagination value={page} onChange={setPage} total={1} />
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </Container>
        </SafeMantineProvider>
    )
}
