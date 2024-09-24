import { useGetEntity } from '@ongoku/app-lib/src/providers/provider'
import { Button, ButtonGroup, Title } from '@mantine/core'
import { ServerResponseWrapper } from '@ongoku/app-lib/src/components/mantine/ServerResponseWrapper'
import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'
import { useContext } from 'react'
import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3'
import { ID } from '@ongoku/app-lib/src/common/scalars'

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
        </div>
    )
}

interface DefaultApplyActionRequest {
    entityID: string
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
        const method = appInfo.getMethod(action.methodNamespace)
        if (!method) {
            console.error('Method not found', 'namespace', action.methodNamespace)
            throw new Error('Method not found')
        }
        return (
            <Button
                key={action.name}
                onClick={() => {
                    console.log('Calling action', action.name)
                    method.makeAPIRequest<DefaultApplyActionRequest, E>({
                        entityID: props.id,
                    })
                }}
            >
                {action.name}
            </Button>
        )
    })

    return <ButtonGroup>{actionButtons}</ButtonGroup>
}
