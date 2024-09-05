import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { EnumInfo } from '@ongoku/app-lib/src/common/Enum'
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/common/Type'

export interface IServiceInfo {
    name: string
    defaultIcon?: React.ElementType
    getEntityInfo<E extends EntityMinimal>(name: string): EntityInfo<E>
    entityInfos: EntityInfo<any>[]
    getTypeInfo<T extends TypeMinimal>(name: string): TypeInfo<T>
    getEnumInfo<EN>(name: string): EnumInfo<EN> | undefined
}

export interface NewServiceInfoReq {
    name: string
    entityInfos: EntityInfo<any>[]
    typeInfos: TypeInfo<any>[]
    defaultIcon?: React.ElementType
}

// U is a union type of all Entities
export class ServiceInfo implements IServiceInfo {
    name: string
    entityInfos: EntityInfo<EntityMinimal>[] // Distributive conditional type, that should become []EntityInfo < entA | entB etc. >
    typeInfosMap: Record<string, TypeInfo<any>> = {} // local service types

    enumInfos: Record<string, EnumInfo<any>> = {}

    defaultIcon?: React.ElementType

    constructor(props: NewServiceInfoReq) {
        this.name = props.name
        this.entityInfos = props.entityInfos
        // Type Infos
        props.typeInfos.forEach((typInfo: TypeInfo<any>) => {
            this.typeInfosMap[typInfo.name] = typInfo
        })
        this.defaultIcon = props.defaultIcon
    }

    getEntityInfo<E extends EntityMinimal>(name: string): EntityInfo<E> {
        var entityInfo = this.entityInfos.find((elem) => elem.getEntityName() === name) as unknown
        return entityInfo as EntityInfo<E>
    }

    // T should be a type, one that is at the service level
    getTypeInfo<T extends TypeMinimal>(name: string) {
        var typeInfo = this.typeInfosMap[name] as unknown
        return typeInfo as TypeInfo<T>
    }

    getEnumInfo<EN>(name: string): EnumInfo<EN> | undefined {
        return this.enumInfos[name] as unknown as EnumInfo<EN>
    }
}
