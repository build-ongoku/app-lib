import { ITypeInfo, NewTypeInfoReq, TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type'
import { EnumInfo } from '@ongoku/app-lib/src/archive/common/Enum'
import { FieldInfo } from '@ongoku/app-lib/src/common/Field'
import { ID } from '@ongoku/app-lib/src/common/scalars'

import { capitalCase } from 'change-case'
import { IWithMethods, Method, WithMethods, WithMethodsReq } from './method'

// EntityMinimal represents fields that all Entities should have.
export interface EntityMinimal extends TypeMinimal {
    id: ID
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

/* * * * * * * * * * * * * *
 * Props
 * * * * * * * * * * * * * */

/* * * * * * * * * * * * * *
 * Interface EntityInfo
 * * * * * * * * * * * * * */

export interface IEntityInfo<E extends EntityMinimal> extends ITypeInfo, IWithMethods {
    serviceName: string
    getName(): string
    getNameFormatted(): string
    getEntityName(e: E): string
    getEntityHumanName(e: E): string
    columnsFieldsForListView: (keyof E)[]
    getFieldInfo(fieldName: keyof E): FieldInfo | undefined
}

/* * * * * * * * * * * * * *
 * Default?
 * * * * * * * * * * * * * */

/* * * * * * * * * * * * * *
 * Class EntityInfo
 * * * * * * * * * * * * * */

// EntityInfoInputProps are the used by the EntityInfo constructor
export interface NewEntityInfoReq<E extends EntityMinimal> extends NewTypeInfoReq<E> {
    serviceName: string
    enumInfos?: EnumInfo<any>[]
    typeInfos?: TypeInfo<any>[]
    getEmptyInstance: () => E

    withMethodsReq: WithMethodsReq
}

// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
export class EntityInfo<E extends EntityMinimal> extends TypeInfo<E> implements IEntityInfo<E> {
    // other properties inherited from TypeInfo

    serviceName: string
    readonly typeInfo: TypeInfo<E>
    typeInfos: Record<string, TypeInfo<any>> = {}
    enumInfos: Record<string, EnumInfo<any>> = {}
    getEmptyInstance: () => E

    withMethods: WithMethods

    // 1. Custom props/methods. Each implementation has to define these.
    constructor(props: NewEntityInfoReq<E>) {
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

        this.withMethods = new WithMethods(props.withMethodsReq)
    }

    // 2. Basic props/methods - which are shared by all and need not be overridden.

    // List page properties
    // columnsFieldsForListView is a list of field names for T
    columnsFieldsForListView: (keyof E)[] // default, but can be overwritten per instance

    // 3. Default props/methods, which could be overridden later (or not)

    // Name of the Entity Type
    getName(): string {
        return this.nameFunc(this)
    }
    // default function, overridable
    nameFunc = function (info: EntityInfo<E>): string {
        return info.name
    }

    // Human readable Name of the Entity Type
    getNameFormatted(): string {
        return this.nameFormattedFunc(this)
    }
    // default function, overridable
    nameFormattedFunc = function (info: EntityInfo<E>): string {
        return capitalCase(info.getName())
    }

    // Name of an Entity instance
    getEntityName(r: E): string {
        return this.entityNameFunc(r, this)
    }
    // default function, overridable
    entityNameFunc = function (r: E, info: EntityInfo<E>): string {
        return r.id
    }

    // Human Friendly name for an instance of an entity
    getEntityHumanName(r: E): string {
        return this.entityHumanNameFunc(r, this)
    }
    // overridable
    entityHumanNameFunc = function (r: E, info: EntityInfo<E>): string {
        const _r: any = r
        if (_r.name) {
            // Simple string name
            if (typeof _r.name === 'string') {
                return capitalCase(_r.name)
            }
            // Person Name (First + Last)
            if (_r.name.first_name && _r.name.last_name) {
                return `${capitalCase(_r.name.first_name)} ${capitalCase(_r.name.last_name)}`
            }
        }
        return r.id
    }

    getTypeInfo<T extends TypeMinimal = E>(name: string): TypeInfo<T> | undefined {
        // if name is same as entity, return the entity typeInfo
        if (name == this.name) {
            return this.typeInfo as unknown as TypeInfo<T>
        }
        return this.typeInfos[name as string] as unknown as TypeInfo<T>
    }

    getEnumInfo<EN>(name: string): EnumInfo<EN> | undefined {
        return this.enumInfos[name] as unknown as EnumInfo<EN>
    }

    // Inherited methods (forwarding)
    getMethod<reqT, respT>(name: string): Method<reqT, respT> {
        return this.withMethods.getMethod(name)
    }
}
