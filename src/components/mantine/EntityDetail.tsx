import { useGetEntity } from '../../providers/provider'
import { EntityInfo, EntityMinimal } from '../../common/Entity'
import { Title } from '@mantine/core'
import { ServerResponseWrapper } from '../../components/mantine/ServerResponseWrapper'

export const EntityDetail = <E extends EntityMinimal = any>(props: { entityInfo: EntityInfo<E>; identifier: string }) => {
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
                        <Title order={1}>{entityInfo.getHumanName(resp.data)}</Title>
                        <span>{JSON.stringify(resp.data)}</span>
                    </>
                )}
            </ServerResponseWrapper>
        </div>
    )
}
