import { FieldInfo, MetaFields } from '@ongoku/app-lib/src/common/Field'
import { EnumInfo } from '@ongoku/app-lib/src/archive/common/Enum'
import { WithMetaFields } from '../../common/types'

export interface ITypeInfo extends ITypeInfoOverridable {
    name: string
    fieldInfos: FieldInfo[]
}

export interface ITypeInfoOverridable {
    getTypeName: () => string
}

export interface NewTypeInfoReq<T extends TypeMinimal> {
    name: string
    serviceName: string
    fieldInfos: FieldInfo[]
    enumInfos?: EnumInfo<any>[]
    getEmptyInstance: () => WithMetaFields<T>
}

// TypeMinimal represents fields that all Types should have.
export interface TypeMinimal extends Object {}
export interface TypeMinimalWithMeta extends TypeMinimal, MetaFields {}

// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
export class TypeInfo<T extends TypeMinimal> implements ITypeInfo {
    name: string
    fieldInfos: FieldInfo[]
    serviceName: string
    enumInfos: Record<string, EnumInfo<any>> = {}
    getEmptyInstance: () => WithMetaFields<T>

    constructor(props: NewTypeInfoReq<T>) {
        this.name = props.name
        this.serviceName = props.serviceName
        this.fieldInfos = props.fieldInfos

        props.enumInfos?.forEach((enumInfo: EnumInfo<any>) => {
            this.enumInfos[enumInfo.name] = enumInfo
        })

        this.getEmptyInstance = props.getEmptyInstance || (() => ({} as WithMetaFields<T>))
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
