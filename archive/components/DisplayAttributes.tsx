import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext'
import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity'
import { FieldInfo, getValueForField } from '@ongoku/app-lib/src/common/Field'
import { ID } from '@ongoku/app-lib/src/common/scalars'
import { TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type'
import { EntityLinkFromID } from '@ongoku/app-lib/src/components/antd/EntityLink'
import ReactJson from '@microlink/react-json-view'
import React, { useContext, useState } from 'react'

export interface FieldDisplayProps<T extends TypeMinimal> {
    fieldInfo: FieldInfo
    objectValue: T
    DisplayComponent: React.ComponentType<DisplayProps<any>>
}

export const FieldDisplay = <T extends TypeMinimal | TypeMinimal[]>(props: FieldDisplayProps<T>) => {
    const { fieldInfo, objectValue, DisplayComponent } = props
    const fieldValue = getValueForField({ obj: objectValue, fieldInfo: fieldInfo })

    return <DisplayComponent value={fieldValue} />
}

export interface DisplayProps<T = any> {
    value?: T
}

export const DefaultDisplay = <FT extends any>(props: DisplayProps<FT>) => {
    return <>{props.value}</>
}

export const ObjectDisplay = <FT extends Object>(props: DisplayProps<FT>) => {
    return <ReactJson src={props.value!} />
}

export const StringDisplay = <FT extends string>(props: DisplayProps<FT>) => {
    return <>{props.value}</>
}

export const BooleanDisplay = <FT extends boolean>(props: DisplayProps<FT>) => {
    // TODO: Handle null
    return <>{props.value ? 'YES' : 'NO'}</>
}

export const DateDisplay = <FT extends Date>(props: DisplayProps<FT>) => {
    const d = new Date(props.value as Date)
    return <DefaultDisplay value={d.toDateString()} />
}

export const TimestampDisplay = <FT extends Date>(props: DisplayProps<FT>) => {
    if (!props.value) {
        return (
            <span>
                <i>No Data</i>
            </span>
        )
    }
    const d = new Date(props.value as Date)
    return <DefaultDisplay value={d.toUTCString()} />
}

export const RepeatedDisplay = <FT extends any>(props: { value: FT[]; DisplayComponent: React.ComponentType<DisplayProps<FT>> }) => {
    return (
        <div>
            <div>Repeated Display: {props.value.length} items</div>
            <span>{JSON.stringify(props.value)}</span>
        </div>
    )
}

// export const PersonNameDisplay = <T extends PersonName>(props: DisplayProps<T>) => {
//     const { value } = props
//     let text = ''
//     text += value?.first_name
//     if (value?.middle_initial) {
//         text += ' ' + value.middle_initial
//     }
//     text += ' ' + value?.last_name
//     return <DefaultDisplay value={text} />
// }

// export const PhoneNumberDisplay = <T extends PhoneNumber>(props: DisplayProps<T>) => {
//     const { value } = props
//     let text = ''
//     text += `+${value?.country_code} ${value?.number}`
//     if (value?.extension) {
//         text += ` x${value?.extension}`
//     }
//     return <DefaultDisplay value={text} />
// }

export interface ForeignEntityFieldDisplayProps {
    fieldInfo: FieldInfo
}

export const getForeignEntityFieldDisplayComponent = <ForeignEntityType extends EntityMinimal>(props: ForeignEntityFieldDisplayProps): React.ComponentType<DisplayProps<any>> => {
    const { fieldInfo } = props

    return (props: DisplayProps<ID>) => {
        const [foreignEntityInfo, setForeignEntityInfo] = useState<EntityInfo<ForeignEntityType>>()

        // Get ServiceInfo from context
        const { appInfo, loading } = useContext(AppInfoContext)

        if (!fieldInfo.foreignEntityInfo) {
            throw new Error('ForeignEntity DisplayProps for field with no foreignEntityInfo')
        }

        if (fieldInfo.foreignEntityInfo.serviceName && fieldInfo.foreignEntityInfo.entityName) {
            const foreignEntityInfoLocal = appInfo?.getEntityInfo<ForeignEntityType>(fieldInfo.foreignEntityInfo.serviceName, fieldInfo.foreignEntityInfo.entityName)
            if (foreignEntityInfoLocal) {
                setForeignEntityInfo(foreignEntityInfoLocal)
            }
        }

        const { value: foreignEntityId } = props

        return <EntityLinkFromID entityInfo={foreignEntityInfo!} id={foreignEntityId!} />
    }
}
