import { Namespace } from '@/common/Namespace'
import { TypeMinimal, TypeInfo } from '@/common/Type'

// FieldInfoProps require both FieldInfo and EntityInfo
export interface FieldInfoProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
    fieldInfo: FieldInfo
}

export interface FieldProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
    type: T
    fieldInfo: FieldInfo
}

export interface FieldInfo {
    name: string
    kind: FieldKind
    isRepeated?: boolean
    referenceNamespace?: Namespace // required when field is a nested type

    isMetaField?: boolean
    foreignEntityInfo?: ForeignEntityInfo
}

interface ForeignEntityInfo {
    serviceName?: string
    entityName?: string
}

// getFieldValue takes an Entity and FieldInfo, and returns the value for the Field
export const getValueForField = <T extends TypeMinimal = any, FieldT = any>(props: { obj: T; fieldInfo: FieldInfo }): FieldT => {
    const { obj, fieldInfo } = props
    // Loop though the entity values and get the right value
    let val: any
    Object.entries(obj).forEach(([k, v]) => {
        if (k === fieldInfo.name) {
            val = v as FieldT
        }
    })
    return val as FieldT
}

// FieldKind describes what category a field falls under e.g. Number, Date, Money, Foreign Object etc.
export interface FieldKind {
    readonly name: string
}

const DefaultFieldKind = {
    name: 'default',
}

export const UUIDKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'uuid',
}

export const StringKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'string',
}

export const NumberKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'number',
}

export const BooleanKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'boolean',
}

export const DateKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'date',
}

export const TimestampKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'datetime',
}

export const EnumKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'enum',
}

// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export const NestedKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'nested',
}
