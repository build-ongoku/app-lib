import { listEntityV2, useGetEntity, useListEntityV2 } from '@ongoku/app-lib/src/providers/provider'
import { Button, ButtonGroup, Title } from '@mantine/core'
import { ServerResponseWrapper } from '@ongoku/app-lib/src/components/mantine/ServerResponseWrapper'
import { EntityAssociation, EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'
import { useContext, useState } from 'react'
import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3'
import { ID } from '@ongoku/app-lib/src/common/scalars'
import { Operator } from '@ongoku/app-lib/src/common/Filter'
import { EntityListTableInner } from './EntityList'

export const EntityDetail = <E extends IEntityMinimal = any>(props: { entityInfo: EntityInfo<E>; identifier: string }) => {
    const { entityInfo, identifier } = props

    // Todo: Assume that the identifier is the id for now but this could include any other human readable identifier

    // Fetch the entity from the server
    const [resp] = useGetEntity<E>({
        entityInfo,
        data: {
            id: identifier,
        },
    })

    return (
        <div>
            <ServerResponseWrapper error={resp.error} loading={resp.loading}>
                {resp.data && (
                    <div className="flex flex-col gap-4">
                        <Title order={1}>{entityInfo.getEntityNameFriendly(resp.data)}</Title>
                        <EntityActionButtons entityInfo={entityInfo} id={identifier} />
                        <pre>{JSON.stringify(resp.data, null, 2)}</pre>
                    </div>
                )}
            </ServerResponseWrapper>
            <EntityAssociations entityInfo={entityInfo} entityID={identifier} />
        </div>
    )
}

const EntityAssociations = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; entityID: ID }) => {
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const items = props.entityInfo.associations.map((assoc) => {
        return <EntityAssociationGeneric key={assoc.name.toRaw()} entityInfo={props.entityInfo} assoc={assoc} entityID={props.entityID} />
    })

    return <div>{items}</div>
}

const EntityAssociationGeneric = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; assoc: EntityAssociation; entityID: ID }) => {
    const { assoc, entityInfo, entityID } = props

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

    // From the entity, get the corresponding other association.
    const otherAssoc = otherEntityInfo.associations.find((a) => {
        console.log('[EntityDetail] [EntityAssociationGeneric] Finding matching association in corresponding entity')
        const expectedRelationship = assoc.relationship === 'parent_of' ? 'child_of' : 'child_of' ? 'parent_of' : undefined
        if (!expectedRelationship) {
            throw new Error('Could not determine the expected relationship of the corresponding entity association')
        }
        return a.relationship === expectedRelationship && a.entityNamespace.equal(props.entityInfo.namespace) && a.name.equal(assoc.otherAssociationName)
    })
    if (!otherAssoc) {
        const errMsg = '[EntityDetail] [EntityAssociationGeneric] Corresponding association not found'
        console.error(errMsg, 'name', assoc.otherAssociationName.toRaw())
        throw new Error(errMsg)
    }

    // From the other association, get the field name of the other entity that links to this entity
    // otherEntityFieldName should of type keyof E2
    const otherEntityFieldName = otherAssoc.name.toFieldName() as keyof E
    console.debug('[EntityDetail] [EntityAssociationGeneric] Field name for corresponding entity found:', otherEntityFieldName)

    if (assoc.relationship === 'parent_of') {
        return <EntityAssociationChildren entityInfo={entityInfo} assoc={assoc} otherEntityInfo={otherEntityInfo} entityID={entityID} otherEntityFieldName={otherEntityFieldName} />
    }
    if (assoc.relationship === 'child_of') {
        return <EntityAssociationParent entityInfo={entityInfo} assoc={assoc} otherEntityInfo={otherEntityInfo} entityID={entityID} otherEntityFieldName={otherEntityFieldName} />
    }

    console.warn('[EntityDetail] [EntityAssociationGeneric] Association type is not yet implemented', 'relationship', assoc.relationship)
}

const EntityAssociationChildren = <E extends IEntityMinimal, E2 extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>
    assoc: EntityAssociation
    otherEntityInfo: EntityInfo<E2>
    entityID: ID
    otherEntityFieldName: keyof E2
}) => {
    const { entityInfo, assoc, otherEntityInfo, entityID, otherEntityFieldName } = props

    const [resp, loading] = useListEntityV2({
        entityInfo: otherEntityInfo,
        data: {
            filter: {
                [otherEntityFieldName]: {
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

const EntityAssociationParent = <E extends IEntityMinimal, E2 extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>
    assoc: EntityAssociation
    otherEntityInfo: EntityInfo<E2>
    entityID: ID
    otherEntityFieldName: keyof E2
}) => {
    const { entityInfo, assoc, otherEntityInfo, entityID, otherEntityFieldName } = props

    const [resp, loading] = useListEntityV2({
        entityInfo: otherEntityInfo,
        data: {
            filter: {
                [otherEntityFieldName]: {
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

interface DefaultEntityRequest {
    ID: string
}

const EntityActionButtons = <E extends IEntityMinimal>(props: { entityInfo: EntityInfo<E>; id: ID }) => {
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
            console.error('[EntityDetail] [EntityActionButtons] Method not found', 'namespace', action.methodNamespace)
            throw new Error('Method not found')
        }
        return (
            <Button
                key={action.name.toRaw()}
                onClick={() => {
                    console.log('[EntityDetail] [EntityActionButtons] [Button] Calling action', 'action', action.name.toRaw())
                    method
                        .makeAPIRequest<DefaultEntityRequest, E>({
                            ID: props.id,
                        })
                        .then((resp) => {
                            console.log('[EntityDetail] [EntityActionButtons] [Button] [Response]', 'data', resp.data)
                            // refresh the page
                            window.location.reload()
                        })
                }}
            >
                {action.name.toCapital()}
            </Button>
        )
    })

    return <ButtonGroup>{actionButtons}</ButtonGroup>
}
