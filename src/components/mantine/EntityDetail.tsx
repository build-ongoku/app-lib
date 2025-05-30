'use client'

import { Button, ButtonGroup, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { EntityAssociation, EntityInfo, IEntityMinimal } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { Operator } from '../../common/Filter'
import { ID } from '../../common/scalars'
import { getEntityAddPath, getEntityChatPath, getEntityEditPath, getEntityListPath } from '../EntityLink'
import { EntityListTableInner } from './EntityList'
import { ServerResponseWrapper } from './ServerResponseWrapper'
import { FetchFunc, useGetEntity, useListEntity } from '../../providers/httpV2'
import React, { useContext, useState, useEffect } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { MdAdd, MdOutlineFormatListBulleted, MdChat } from 'react-icons/md'
import { Router } from '../../common/types'

export const EntityDetail = <E extends IEntityMinimal = IEntityMinimal>(props: { entityInfo: EntityInfo<E>; identifier: string; router: Router }) => {
    const { entityInfo, identifier, router } = props

    // Check URL for entity data passed from creation page
    const [initialData, setInitialData] = React.useState<E | null>(null)
    const [shouldFetch, setShouldFetch] = React.useState(false)

    React.useEffect(() => {
        // Get and parse entity data from URL if it exists
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            const entityDataParam = urlParams.get('entityData')

            if (entityDataParam) {
                try {
                    // Parse the entity data
                    const parsedData = JSON.parse(decodeURIComponent(entityDataParam)) as E
                    console.log('[EntityDetail] Found entity data in URL params', parsedData)
                    setInitialData(parsedData)

                    // Clean up URL by removing the parameter
                    urlParams.delete('entityData')
                    const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
                    window.history.replaceState({}, '', newUrl)
                } catch (error) {
                    console.error('[EntityDetail] Error parsing entity data from URL', error)
                    setShouldFetch(true)
                }
            } else {
                setShouldFetch(true)
            }
        } else {
            setShouldFetch(true)
        }
    }, [])

    // Todo: Assume that the identifier is the id for now but this could include any other human readable identifier

    const { resp, loading, error, fetchDone, fetch } = useGetEntity<E>({
        entityNamespace: entityInfo.namespace.toRaw(),
        data: {
            id: identifier,
        },
        skipFetchAtInit: true,
    })

    // If we have initialData, use it immediately
    // If not, trigger the fetch
    React.useEffect(() => {
        if (!initialData && shouldFetch) {
            fetch()
        }
    }, [initialData, shouldFetch])

    // Use initialData if available, otherwise use response data
    const entityData = initialData || resp?.data

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between my-5">
                    <Title order={2}>
                        {entityInfo.getNameFriendly()}: {entityData ? entityInfo.getEntityNameFriendly(entityData) : 'Unknown'}
                    </Title>
                    <div className="flex gap-3">
                        <Button
                            autoContrast
                            leftSection={<FiEdit2 />}
                            onClick={() => {
                                router.push(
                                    getEntityEditPath<E>({
                                        entityInfo: entityInfo,
                                        entity: resp?.data!,
                                    })
                                )
                            }}
                            loading={loading}
                            disabled={!!error || !resp?.data || loading}
                        >
                            Edit
                        </Button>
                        <Button
                            leftSection={<MdAdd />}
                            onClick={() => {
                                router.push(getEntityAddPath(entityInfo))
                            }}
                        >
                            New
                        </Button>
                        <Button
                            leftSection={<MdOutlineFormatListBulleted />}
                            onClick={() => {
                                router.push(getEntityListPath(entityInfo))
                            }}
                        >
                            List
                        </Button>
                        <Button
                            leftSection={<MdChat />}
                            onClick={() => {
                                router.push(getEntityChatPath(entityInfo))
                            }}
                            disabled={true}
                        >
                            Chat
                        </Button>
                    </div>
                </div>
                <ServerResponseWrapper error={error || resp?.error} loading={loading && !initialData}>
                    {entityData && (
                        <>
                            <EntityActions entityInfo={entityInfo} id={identifier} refetchEntity={fetch} />
                            <pre>{JSON.stringify(entityData, null, 2)}</pre>
                            <EntityAssociations entityInfo={entityInfo} entityID={identifier} entityData={entityData} />
                        </>
                    )}
                </ServerResponseWrapper>
            </div>
        </div>
    )
}

const EntityAssociations = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; entityID: ID; entityData: E }) => {
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const items = props.entityInfo.associations.map((assoc) => {
        return <EntityAssociationGeneric key={assoc.name.toRaw()} entityInfo={props.entityInfo} assoc={assoc} entityID={props.entityID} entityData={props.entityData} />
    })

    return <div className="flex flex-col gap-10">{items}</div>
}

const EntityAssociationGeneric = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; assoc: EntityAssociation; entityID: ID; entityData: E }) => {
    const { assoc, entityInfo, entityID, entityData } = props

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    // Get the other entity info
    const otherEntityInfo = appInfo.getEntityInfo<any>(assoc.entityNamespace.toRaw())
    if (!otherEntityInfo) {
        const errMsg = '[EntityDetail] [EntityAssociationGeneric] Corresponding entity not found'
        console.error(errMsg, 'namespace', assoc.entityNamespace)
        throw new Error(errMsg)
    }

    if (assoc.relationship === 'parent_of') {
        return <EntityAssociationParentOf entityInfo={entityInfo} assoc={assoc} entityID={entityID} otherEntityInfo={otherEntityInfo} />
    }
    if (assoc.relationship === 'child_of') {
        // If an entity is a child, the parent ID is stored in the entity itself
        return <EntityAssociationChildOf entityInfo={entityInfo} assoc={assoc} entityID={entityID} entityData={entityData} otherEntityInfo={otherEntityInfo} />
    }

    console.warn('[EntityDetail] [EntityAssociationGeneric] Association type is not yet implemented', 'relationship', assoc.relationship)
}

const EntityAssociationParentOf = <E extends IEntityMinimal, E2 extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>
    assoc: EntityAssociation
    entityID: ID
    otherEntityInfo: EntityInfo<E2>
}) => {
    const { entityInfo, entityID, assoc, otherEntityInfo } = props

    // From the entity, get the corresponding other association.
    const otherAssoc = otherEntityInfo.associations.find((a) => {
        console.log('[EntityDetail] [EntityAssociationGeneric] Finding matching association in corresponding entity')
        const expectedRelationship = 'child_of'
        return a.relationship === expectedRelationship && a.entityNamespace.equal(props.entityInfo.namespace) && assoc.otherAssociationName && a.name.equal(assoc.otherAssociationName)
    })
    if (!otherAssoc) {
        const errMsg = '[EntityDetail] [EntityAssociationGeneric] Corresponding association not found'
        console.error(errMsg, 'name', assoc.otherAssociationName?.toRaw())
        throw new Error(errMsg)
    }

    // From the other association, get the field name of the other entity that links to this entity
    // otherEntityFieldName should of type keyof E2
    // const otherEntityFieldName = otherAssoc.name.toFieldName() as keyof E2
    const otherEntityFilterFieldName = (otherAssoc.type === 'many' ? 'having' + otherAssoc.toFieldName().toPascal() : otherAssoc.toFieldName().toFieldName()) as keyof E2
    console.debug('[EntityDetail] [EntityAssociationGeneric] Field name for corresponding entity found:', otherEntityFilterFieldName)

    const { resp, loading, error, fetchDone, fetch } = useListEntity<E2>({
        entityNamespace: otherEntityInfo.namespace.toRaw(),
        data: {
            filter: {
                [otherEntityFilterFieldName]: {
                    op: Operator.EQUAL,
                    values: [entityID],
                },
            },
        },
    })

    return (
        <ServerResponseWrapper error={resp?.error} loading={loading}>
            {resp?.data && (
                <div>
                    <Title order={3}>{assoc.name.toCapital()}</Title>
                    <EntityListTableInner entityInfo={otherEntityInfo} data={resp.data} />
                </div>
            )}
        </ServerResponseWrapper>
    )
}

const EntityAssociationChildOf = <E extends IEntityMinimal, E2 extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>
    assoc: EntityAssociation
    entityID: ID
    entityData: E
    otherEntityInfo: EntityInfo<E2>
}) => {
    const { assoc, otherEntityInfo, entityID, entityData } = props

    // The parents don't know about their children. So we need to fetch the parent entity by their IDs. Those IDs are stored in the entity itself
    const assocFieldName = (assoc.type === 'many' ? assoc.name.append('ids').toCamel() : assoc.name.append('id').toCamel()) as keyof E
    // The ID could be a single ID or an array of IDs
    const parentIDs = entityData[assocFieldName]
    if (!parentIDs) {
        console.error('[EntityDetail] [EntityAssociationChildOf] Parent IDs not found', 'fieldName', assocFieldName)
        return null
    }

    // If the parent IDs are an array, we need to fetch all the parents
    const values = Array.isArray(parentIDs) ? parentIDs : [parentIDs]

    const { resp, loading, error, fetchDone, fetch } = useListEntity<E2>({
        entityNamespace: otherEntityInfo.namespace.toRaw(),
        data: {
            filter: {
                id: {
                    op: Operator.IN,
                    values: values,
                },
            },
        },
    })

    return (
        <ServerResponseWrapper error={error || resp?.error} loading={loading}>
            {resp?.data && (
                <div>
                    <Title order={3}>{assoc.name.toCapital()}</Title>
                    <EntityListTableInner entityInfo={otherEntityInfo} data={resp.data} />
                </div>
            )}
        </ServerResponseWrapper>
    )
}

interface DefaultEntityRequest {
    ID: string
}

interface DefaultEntityResponse<E extends IEntityMinimal> {
    Object: E
}

const EntityActions = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; id: ID; refetchEntity: FetchFunc }) => {
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    // For all the actions of the entity, add a button to call the method
    const actions = props.entityInfo.actions
    console.log('[EntityDetail] Entity Actions', actions)

    const actionButtons = actions.map((action) => {
        // Get the method
        const mthdNs = action.methodNamespace
        const method = appInfo.getMethod(mthdNs.toRaw())
        if (!method) {
            console.error('[EntityDetail] [EntityActions] Method not found', 'namespace', action.methodNamespace)
            throw new Error('Method not found')
        }
        const api = method.getAPI()
        if (!api) {
            console.error('[EntityDetail] [EntityActions] API not found', 'method', method.namespace.method)
            throw new Error('API not found')
        }
        return (
            <Button
                variant="outline"
                key={action.name.toRaw()}
                onClick={() => {
                    console.log('[EntityDetail] [EntityActions] [Button] Calling action', 'action', action.name.toRaw())
                    api.makeAPIRequest<DefaultEntityRequest, DefaultEntityResponse<E>>({
                        ID: props.id,
                    }).then((resp) => {
                        console.log('[EntityDetail] [EntityActions] [Button] [Response]', 'data', resp.data)
                        // refresh the page only if the action is successful
                        if (resp.error) {
                            console.error('[EntityDetail] [EntityActions] [Button] [Response] Error', 'error', resp.error)
                            notifications.show({
                                title: `${action.name.toCapital()} Action: Failed`,
                                message: resp.error,
                                color: 'red',
                                position: 'bottom-right',
                            })
                            return
                        }
                        notifications.show({
                            title: `${action.name.toCapital()} Action: Result`,
                            message: <pre>{JSON.stringify(resp.data, null, 2)}</pre>,
                            position: 'bottom-right',
                        })
                        props.refetchEntity()
                    })
                }}
            >
                {action.name.toCapital()}
            </Button>
        )
    })

    return (
        <>
            <ButtonGroup>{actionButtons}</ButtonGroup>
        </>
    )
}
