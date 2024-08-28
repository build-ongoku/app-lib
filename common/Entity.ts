import { TypeInfo, TypeInfoCommon, TypeInfoInputProps, TypeMinimal } from 'goku.static/common/Type'
import { EnumInfo } from 'goku.static/common/Enum'
import { FieldInfo } from 'goku.static/common/Field'
import { UUID } from 'goku.static/common/Primitives'

import { capitalCase } from 'change-case'

// EntityMinimal represents fields that all Entities should have.
export interface EntityMinimal extends TypeMinimal {
    id: UUID
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

/* * * * * * * * * * * * * *
 * Props
 * * * * * * * * * * * * * */

export interface EntityProps<E extends EntityMinimal, UTI extends TypeInfoCommon> {
    entity: E
    entityInfo: EntityInfo<E>
}

export interface EntityInfoProps<E extends EntityMinimal, UTI extends TypeInfoCommon> {
    entityInfo: EntityInfo<E>
}

/* * * * * * * * * * * * * *
 * EntityInfo
 * * * * * * * * * * * * * */

// EntityInfoCommon is the simplest form of EntityInfo without any types
export interface EntityInfoCommon extends TypeInfoCommon {
    serviceName: string
    getEntityName(): string
    getEntityNameFormatted(): string
}

export interface EntityInfoCommonV2<E extends EntityMinimal> extends EntityInfoCommon {
    getName(e: E): string
    getHumanName(e: E): string
    columnsFieldsForListView: (keyof E)[]
    getFieldInfo(fieldName: keyof E): FieldInfo | undefined
}

// // EntityInfoShared are the EntityInfo properties that are constant and shared among all EntityInfo
// export interface EntityInfoShared<T extends EntityMinimal> extends EntityInfoCommon {
//     //getServiceInfo(): ServiceInfo<T> | null
//     getFieldInfo(name: keyof T): FieldInfo | undefined
//     getEntityName(): string
//     getEntityNameFormatted(): string
//     getName(r: T): string
//     getHumanName(r: T): string
// }

// // EntityInfoOverridable are EntityInfo fields that can be overridden for specific entityInfos
// export interface EntityInfoOverridable<T extends EntityMinimal> {
//     columnsFieldsForListView: (keyof T)[]
//     getEntityNameFunc: (info: EntityInfo<T>) => string
//     getEntityNameFormattedFunc: (info: EntityInfo<T>) => string
//     getName: (r: T) => string
//     getHumanNameFunc: (r: T, info: EntityInfo<T>) => string
// }

/* * * * * * * * * * * * * *
 * Default?
 * * * * * * * * * * * * * */

// EntityInfoInputProps are the used by the EntityInfo constructor
export interface EntityInfoInputProps<E extends EntityMinimal> extends TypeInfoInputProps {
    serviceName: string
    enumInfos?: EnumInfo[]
    typeInfos?: TypeInfo[]
    getEmptyInstance: () => E
}

// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
export class EntityInfo<E extends EntityMinimal = any> extends TypeInfo<E> implements EntityInfoCommonV2<E> {
    // other properties inherited from TypeInfo

    readonly typeInfo: TypeInfo<E>
    typeInfos: Record<string, TypeInfo> = {}
    enumInfos: Record<string, EnumInfo> = {}
    serviceName: string
    getEmptyInstance: () => E

    // 1. Custom props/methods. Each implementation has to define these.
    constructor(props: EntityInfoInputProps<E>) {
        super(props)

        this.columnsFieldsForListView = ['id', 'created_at', 'updated_at']
        this.typeInfo = new TypeInfo(props)

        props.typeInfos?.forEach((typeInfo) => {
            this.typeInfos[typeInfo.name] = typeInfo
        })

        props.enumInfos?.forEach((enumInfo) => {
            this.enumInfos[enumInfo.name] = enumInfo
        })

        this.serviceName = props.serviceName

        this.getEmptyInstance =
            props.getEmptyInstance ||
            (() => {
                return {
                    id: '',
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null,
                } as E
            })
    }

    // 2. Basic props/methods - which are shared by all and need not be overridden.

    // List page properties
    // columnsFieldsForListView is a list of field names for T
    columnsFieldsForListView: (keyof E)[] // default, but can be overwritten per instance

    // getServiceInfo(): ServiceInfo<T> | null {
    //     return serviceInfoProvider(this.serviceName)
    // }

    // 3. Default props/methods, which could be overridden later (or not)

    // Name of the Entity Type
    getEntityName(): string {
        return this.getEntityNameFunc(this)
    }
    // overridable
    getEntityNameFunc = function (info: EntityInfo<E>): string {
        return info.name
    }

    // Human readable Name of the Entity Type
    getEntityNameFormatted(): string {
        return this.getEntityNameFormattedFunc(this)
    }
    // overridable
    getEntityNameFormattedFunc = function (info: EntityInfo<E>): string {
        return capitalCase(info.name)
    }

    // Name of an Entity instance
    getName(r: E): string {
        return this.getNameFunc(r, this)
    }
    // overridable
    getNameFunc = function (r: E, info: EntityInfo<E>): string {
        return r.id
    }

    // Human Friendly name for an instance of an entity
    getHumanName(r: E): string {
        return this.getHumanNameFunc(r, this)
    }
    getHumanNameFunc(r: E, info: EntityInfo<E>): string {
        const _r: any = r
        if (_r.name) {
            return capitalCase(_r.name)
        }
        return r.id
    }

    getTypeInfo<T extends TypeMinimal = any>(name: string): TypeInfo<T> | undefined {
        // if name is same as entity, return the entity typeInfo
        if (name == this.name) {
            return this.typeInfo as unknown as TypeInfo<T>
        }
        return this.typeInfos[name] as unknown as TypeInfo<T>
    }

    getEnumInfo<EnumType = any>(name: string): EnumInfo<EnumType> | undefined {
        return this.enumInfos[name] as unknown as EnumInfo<EnumType>
    }
}
