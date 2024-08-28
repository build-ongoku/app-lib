import { FieldInfo } from 'goku.static/common/Field'
import { EnumInfo } from 'goku.static/common/Enum'

export interface TypeInfoProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
}

export interface TypeProps<T extends TypeMinimal> {
    obj: T
    typeInfo: TypeInfo<T>
}

export interface TypeInfoCommon {
    name: string
    fieldInfos: FieldInfo[]
    getTypeName: () => string
}

export interface TypeInfoInputProps<T extends TypeMinimal = any> {
    name: string
    serviceName: string
    fieldInfos: FieldInfo[]
    enumInfos?: EnumInfo[]
    getEmptyInstance: () => T
}

// EntityMinimal represents fields that all Entities should have.
export interface TypeMinimal extends Object {}

// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
export class TypeInfo<T extends TypeMinimal = any> implements TypeInfoCommon {
    readonly name: string
    readonly fieldInfos: FieldInfo[]
    readonly serviceName: string
    enumInfos: Record<string, EnumInfo> = {}
    getEmptyInstance: () => T

    constructor(props: TypeInfoInputProps) {
        this.name = props.name
        this.serviceName = props.serviceName
        this.fieldInfos = props.fieldInfos

        props.enumInfos?.forEach((enumInfo) => {
            this.enumInfos[enumInfo.name] = enumInfo
        })

        this.getEmptyInstance = props.getEmptyInstance || (() => ({} as T))
    }

    // Name of the Type
    getTypeName(): string {
        return this.getTypeNameFunc(this)
    }
    // overridable
    getTypeNameFunc = function (info: TypeInfo<T>): string {
        return info.name
    }

    // getFieldInfo provides the FieldInfo corresponding to the field name provided
    getFieldInfo(fieldName: keyof T): FieldInfo {
        const fieldInfo = this.fieldInfos.find((elem) => elem.name === fieldName)
        if (!fieldInfo) {
            throw new Error(String(`FieldInfo not found for field ${String(fieldName)}`))
        }
        return fieldInfo
    }
}
