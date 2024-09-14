import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { useGetEntity } from '@ongoku/app-lib/src/providers/provider'
import { EntityLink } from '../EntityLink'
import { UUID } from '@ongoku/app-lib/src/common/Primitives'
import { Spin, Alert } from 'antd'

interface EntityLinkFromIDProps<E extends EntityMinimal> {
    id: UUID
    entityInfo: EntityInfo<E>
    text?: JSX.Element
}

export const EntityLinkFromID = <E extends EntityMinimal = any>(props: EntityLinkFromIDProps<E>) => {
    const { id, entityInfo } = props

    const [{ loading, error, data: entity }] = useGetEntity<E>({ entityInfo: entityInfo, params: { id: id } })

    if (loading) {
        return <Spin size="small" />
    }

    if (error) {
        return <Alert message={error} type="error" />
    }

    if (!entity) {
        return <Alert message="Panic! No entity data returned" type="error" />
    }

    // Otherwise return a Table view
    return <EntityLink entity={entity} entityInfo={entityInfo} text={props.text} />
}
