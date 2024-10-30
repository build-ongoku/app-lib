import { TypeMinimal, TypeInfo } from '@ongoku/app-lib/src/archive/common/Type'
import { FieldDisplay } from '../DisplayAttributes'
import { getFieldForFieldKind } from './FieldAntd'

// TypeDisplay component displays a Type
export interface TypeDisplayProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
    objectValue: T
    showMetaFields?: boolean
}

export const TypeDisplay = <T extends TypeMinimal>(props: TypeDisplayProps<T>) => {
    const { typeInfo, objectValue } = props

    // Construct Description Items
    let filteredFields = typeInfo.fieldInfos
    // - Remove Meta fields?
    if (!props.showMetaFields) {
        filteredFields = filteredFields.filter((fieldInfo) => {
            return !fieldInfo.isMetaField
        })
    }
    const descriptionsItems: JSX.Element[] = filteredFields.map((fieldInfo): JSX.Element => {
        const fieldKind = fieldInfo.kind
        const fieldComponent = getFieldForFieldKind(fieldKind)
        let DisplayComponent = fieldComponent.getDisplayComponent(fieldInfo)
        if (fieldInfo.isRepeated) {
            DisplayComponent = fieldComponent.getDisplayRepeatedComponent(fieldInfo)
        }

        return (
            <li key={fieldInfo.name}>
                <FieldDisplay fieldInfo={fieldInfo} objectValue={objectValue} DisplayComponent={DisplayComponent} />
            </li>
        )
    })

    // Return a Table view
    return <div>{descriptionsItems}</div>
}
