import { EntityInfo, EntityMinimal, IEntityInfo } from '@ongoku/app-lib/src/common/Entity'
import { EnumInfo } from '@ongoku/app-lib/src/common/Enum'
import { ServiceInfo } from '@ongoku/app-lib/src/common/Service'
import { PrimaryNamespace, Namespace } from '@ongoku/app-lib/src/common/Namespace'
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/common/Type'
import { snakeCase } from 'change-case'

export interface NewAppInfoReq {
    serviceInfos: ServiceInfo[]
    typeInfos: TypeInfo<any>[]
    enumInfos: EnumInfo<any>[]
}
/* U is the union type of all entities in the App, T is the union type of all types in the app.
 * UTI is the union of all possible nested types
 */
export class AppInfo {
    // serviceInfosMap is a collection of Services
    serviceInfosMap: Record<string, ServiceInfo> = {}
    // typeInfosMap is a collection of Types stored at the global level
    typeInfosMap: Record<string, TypeInfo<any>> = {}
    // enumInfos is a collection of Enums stored at the global level
    enumInfos: Record<string, EnumInfo<any>> = {}

    // Constructor shouldn't need to do anything
    constructor(props: NewAppInfoReq) {
        console.log('AppInfo constructor called')
        // Service Infos
        props.serviceInfos.forEach((svcInfo) => {
            this.serviceInfosMap[svcInfo.name] = svcInfo
        })
        // Type Infos
        props.typeInfos.forEach((typInfo) => {
            this.typeInfosMap[typInfo.name] = typInfo
        })
        return
    }

    getServiceInfos() {
        return Object.values(this.serviceInfosMap)
    }

    getServiceInfo(name: string) {
        return this.serviceInfosMap[name]
    }

    // Returns a list of all EntityInfos in the App
    listEntityInfos() {
        return Object.values(this.serviceInfosMap)
            .map((svc) => svc.entityInfos)
            .flat()
    }

    getEntityInfo<E extends EntityMinimal>(serviceName: string, entityName: string): EntityInfo<E> {
        const serviceInfo = this.getServiceInfo(serviceName)

        const entityInfo = serviceInfo.getEntityInfo<E>(entityName)

        return entityInfo
    }

    getEntityInfoByNamespace<E extends EntityMinimal>(ns: Required<PrimaryNamespace>) {
        const serviceName = snakeCase(ns.service)
        const entityName = snakeCase(ns.entity)

        const svcInfo = this.getServiceInfo(serviceName)
        if (!svcInfo) {
            throw new Error(`ServiceInfo not found for service ${serviceName}`)
        }

        // Service Level
        const entityInfo = svcInfo.getEntityInfo<E>(entityName)
        if (!entityInfo) {
            throw new Error(`EntityInfo not found for entity ${entityName} in service ${serviceName}`)
        }
        return entityInfo
    }

    updateEntityInfo(ei: EntityInfo<any>) {
        const serviceInfo = this.getServiceInfo(ei.serviceName)
        serviceInfo.entityInfos.forEach((v: EntityInfo<any>, index: number) => {
            if (ei.name === v.name) {
                serviceInfo.entityInfos[index] = ei
                return
            }
        })
    }

    getTypeInfo<T extends TypeMinimal>(name: string): TypeInfo<T> {
        return this.typeInfosMap[name] as TypeInfo<T>
    }

    getTypeInfoByNamespace<T extends TypeMinimal>(ns: Namespace): TypeInfo<T> {
        if (!ns.type) {
            throw new Error('getTypeInfoByNamespace() called with empty type name')
        }

        const typeName = snakeCase(ns.type)

        // App Level
        if (!ns.service && !ns.entity) {
            const typeInfo = this.getTypeInfo<T>(typeName)
            if (!typeInfo) {
                throw new Error(`TypeInfo ${typeName} not found at the app level`)
            }
            return typeInfo
        }

        if (!ns.service) {
            throw new Error('getTypeInfoByNamespace() called with empty service name but non-empty entity name')
        }

        const serviceName = snakeCase(ns.service!)
        const svcInfo = this.getServiceInfo(serviceName)
        if (!svcInfo) {
            throw new Error(`ServiceInfo not found for service ${serviceName}`)
        }

        if (!ns.entity) {
            const typeInfo = svcInfo.getTypeInfo<T>(typeName)
            if (!typeInfo) {
                throw new Error(`TypeInfo ${typeName} not found in service ${serviceName}`)
            }
            return typeInfo
        }

        // Entity Level
        const entityName = snakeCase(ns.entity)
        const entityInfo = svcInfo.getEntityInfo(ns.entity)
        if (!entityInfo) {
            throw new Error(`EntityInfo ${entityName} not found for service ${serviceName}`)
        }
        const typeInfo = entityInfo.getTypeInfo<T>(typeName)
        if (!typeInfo) {
            throw new Error(`TypeInfo ${typeName} not found in service ${serviceName} and entity ${entityName}`)
        }
        return typeInfo
    }

    getEnumInfo<EN>(name: string): EnumInfo<EN> {
        return this.enumInfos[name] as unknown as EnumInfo<EN>
    }

    getEnumInfoByNamespace<EN>(ns: Namespace): EnumInfo<EN> | undefined {
        if (!ns.enum) {
            throw new Error('getTypeInfoByNamespace() called with empty enum name')
        }

        const enumName = snakeCase(ns.enum)

        // App Level
        if (!ns.service && !ns.entity) {
            return this.getEnumInfo<EN>(enumName)
        }

        const svcInfo = this.getServiceInfo(ns.service!)
        if (!svcInfo) {
            throw new Error(`ServiceInfo not found for service "${ns.service}"`)
        }

        // Service Level
        if (!ns.entity) {
            return svcInfo.getEnumInfo<EN>(enumName)
        }

        // Entity Level
        const entInfo = svcInfo.getEntityInfo(ns.entity)

        return entInfo.getEnumInfo<EN>(enumName)
    }
}
