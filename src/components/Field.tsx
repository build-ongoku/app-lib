import { EntityInfo, EntityMinimal } from '@/common/Entity'
import { FieldInfo } from '@/common/Field'
import ReactJson from '@microlink/react-json-view'
import React from 'react'

export interface FieldFormProps<FormInputPropsT = any> {
    formInputProps: FormInputPropsT
    fieldInfo: FieldInfo
}

// Field describes what category a field falls under e.g. Number, Date, Money, Foreign Object etc.
export interface FieldKindUI {
    readonly name: string

    getLabel: (props: FieldInfo) => JSX.Element
    getLabelString: (props: FieldInfo) => string
    getDisplayComponent: <E extends EntityMinimal>(fieldInfo: FieldInfo, entityInfo?: EntityInfo<E>) => React.ComponentType<DisplayProps>
    getDisplayRepeatedComponent: (fieldInfo: FieldInfo) => React.ComponentType<DisplayProps>
    getInputComponent: () => React.ComponentType<FieldFormProps>
    getInputRepeatedComponent: () => React.ComponentType<FieldFormProps>
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
