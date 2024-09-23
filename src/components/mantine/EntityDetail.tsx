import { useGetEntity } from '@ongoku/app-lib/src/providers/provider'
import { Title } from '@mantine/core'
import { ServerResponseWrapper } from '@ongoku/app-lib/src/components/mantine/ServerResponseWrapper'
import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'

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
                    <>
                        <Title order={1}>{entityInfo.getEntityNameFriendly(resp.data)}</Title>
                        <pre>{JSON.stringify(resp.data, null, 2)}</pre>
                    </>
                )}
            </ServerResponseWrapper>
        </div>
    )
}
