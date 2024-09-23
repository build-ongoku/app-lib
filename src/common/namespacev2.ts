import { capitalCase, snakeCase } from 'change-case'
import { PickAndRequired, RequiredFields } from './types'

/* * * * * *
 * Name
 * * * * * */

interface IName {
    toRaw(): string
    toCapitalized(): string
    toSnake(): string
}

export class Name implements IName {
    raw: string

    constructor(raw: string) {
        // Convert to snake case
        this.raw = snakeCase(raw)
    }

    toRaw(): string {
        return this.raw
    }

    toCapitalized(): string {
        return capitalCase(this.raw)
    }

    toSnake(): string {
        return snakeCase(this.raw)
    }
}

/* * * * * *
 * Interface: Primary Namespace + Namespace
 * * * * * */

// IPrimaryNamespace - has only the primary namespace properties and methods
export interface IPrimaryNamespace {
    service?: string
    entity?: string
    toString(): string
    toURLPath(): string
}

// INamespace - has all the namespace properties and methods
export interface INamespace extends IPrimaryNamespace {
    types?: string[]
    enum?: string
    method?: string
}

type PrimaryNamespaceMethodKeys = 'toString' | 'toURLPath'

export type IToReq<NamespaceT extends IPrimaryNamespace> = Omit<NamespaceT, PrimaryNamespaceMethodKeys>

/* * * * * *
 * Request: Primary Namespace + Namespace
 * * * * * */

interface PrimaryNamespaceReq extends Omit<IPrimaryNamespace, PrimaryNamespaceMethodKeys> {}

interface NamespaceReq extends Omit<INamespace, PrimaryNamespaceMethodKeys> {}

/* * * * * *
 * Classes: Primary Namespace + Namespace
 * * * * * */

export class PrimaryNamespace implements IPrimaryNamespace {
    service?: string
    entity?: string

    constructor(req: PrimaryNamespaceReq) {
        // Store everything in snake case
        this.service = req.service ? snakeCase(req.service) : undefined
        this.entity = req.entity ? snakeCase(req.entity) : undefined
    }

    toString(): string {
        let str = '$'
        if (this.service) {
            str = str + `.service[${this.service}]`
        }
        if (this.entity) {
            str = str + `.entity[${this.entity}]`
        }
        return str
    }

    toURLPath(): string {
        let str = '/'
        if (this.service) {
            str = str + `${this.service}`
        }
        if (this.entity) {
            str = str + `/${this.entity}`
        }
        return str
    }
}

export class Namespace extends PrimaryNamespace implements INamespace {
    types?: string[]
    enum?: string
    method?: string

    constructor(req: NamespaceReq) {
        // Store everything in snake case
        super({ service: req.service, entity: req.entity })
        if (req.types && req.types.length > 0) {
            this.types = req.types.map((type) => snakeCase(type))
        }
        this.enum = req.enum ? snakeCase(req.enum) : undefined
        this.method = req.method ? snakeCase(req.method) : undefined
    }

    toString(): string {
        let str = super.toString()
        if (this.types && this.types.length > 0) {
            str = str + `.type[${this.types.join('.')}]`
        }
        if (this.enum) {
            str = str + `.enum[${this.enum}]`
        }
        if (this.method) {
            str = str + `.method[${this.method}]`
        }
        return str
    }
}

/* * * * * *
 * INamespaceToReq - Conversion
 * * * * * */

export type INamespaceToReq<T extends INamespace> = T extends IServiceNamespace
    ? ServiceNamespaceReq
    : T extends IEntityNamespace
    ? EntityNamespaceReq
    : T extends ITypeAppNamespace
    ? TypeAppNamespaceReq
    : T extends ITypeServiceNamespace
    ? TypeServiceNamespaceReq
    : T extends ITypeEntityNamespace
    ? TypeEntityNamespaceReq
    : T extends IEnumAppNamespace
    ? EnumAppNamespaceReq
    : T extends IEnumServiceNamespace
    ? EnumServiceNamespaceReq
    : T extends IEnumEntityNamespace
    ? EnumEntityNamespaceReq
    : T extends IEnumTypeNamespace
    ? EnumTypeNamespaceReq
    : T extends IMethodServiceNamespace
    ? MethodServiceNamespaceReq
    : T extends IMethodEntityNamespace
    ? MethodEntityNamespaceReq
    : NamespaceReq

export type NamespaceReqToINamespace<T extends NamespaceReq> = T extends ServicePrimaryNamespaceReq
    ? IServicePrimaryNamespace
    : T extends EntityPrimaryNamespaceReq
    ? IEntityPrimaryNamespace
    : T extends TypeAppNamespaceReq
    ? ITypeAppNamespace
    : T extends TypeServiceNamespaceReq
    ? ITypeServiceNamespace
    : T extends TypeEntityNamespaceReq
    ? ITypeEntityNamespace
    : T extends EnumAppNamespaceReq
    ? IEnumAppNamespace
    : T extends EnumServiceNamespaceReq
    ? IEnumServiceNamespace
    : T extends EnumEntityNamespaceReq
    ? IEnumEntityNamespace
    : T extends EnumTypeNamespaceReq
    ? IEnumTypeNamespace
    : T extends MethodServiceNamespaceReq
    ? IMethodServiceNamespace
    : T extends MethodEntityNamespaceReq
    ? IMethodEntityNamespace
    : never

/* * * * * *
 * NamespaceReq - Variants
 * * * * * */

// Service
export interface ServicePrimaryNamespaceReq extends PickAndRequired<PrimaryNamespaceReq, 'service'> {}
export interface ServiceNamespaceReq extends ServicePrimaryNamespaceReq {}

// Entity
export interface EntityPrimaryNamespaceReq extends PickAndRequired<PrimaryNamespaceReq, 'service' | 'entity'> {}
export interface EntityNamespaceReq extends EntityPrimaryNamespaceReq {}

// Type
export interface TypeAppNamespaceReq extends PickAndRequired<NamespaceReq, 'types'> {}
export interface TypeServiceNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'types'> {}
export interface TypeEntityNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'entity' | 'types'> {}
export type TypeNamespaceReq = TypeAppNamespaceReq | TypeServiceNamespaceReq | TypeEntityNamespaceReq

// Enum
export interface EnumAppNamespaceReq extends PickAndRequired<NamespaceReq, 'enum'> {}
export interface EnumServiceNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'enum'> {}
export interface EnumEntityNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'entity' | 'enum'> {}
export interface EnumTypeNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'entity' | 'types' | 'enum'> {}
export type EnumNamespaceReq = EnumAppNamespaceReq | EnumServiceNamespaceReq | EnumEntityNamespaceReq | EnumTypeNamespaceReq

// Method
export interface MethodServiceNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'method'> {}
export interface MethodEntityNamespaceReq extends PickAndRequired<NamespaceReq, 'service' | 'entity' | 'method'> {}
export type MethodNamespaceReq = MethodServiceNamespaceReq | MethodEntityNamespaceReq

/* * * * * *
 * INamespace - Variants
 * * * * * */

// Service
export interface IServicePrimaryNamespace extends RequiredFields<IPrimaryNamespace, 'service'> {}
export interface IServiceNamespace extends IServicePrimaryNamespace {}

// Entity
export interface IEntityPrimaryNamespace extends RequiredFields<IPrimaryNamespace, 'service' | 'entity'> {}
export interface IEntityNamespace extends IEntityPrimaryNamespace {}

// Type
export interface ITypeAppNamespace extends RequiredFields<INamespace, 'types'> {}
export interface ITypeServiceNamespace extends RequiredFields<INamespace, 'service' | 'types'> {}
export interface ITypeEntityNamespace extends RequiredFields<INamespace, 'service' | 'entity' | 'types'> {}
export type ITypeNamespace = ITypeAppNamespace | ITypeServiceNamespace | ITypeEntityNamespace

// Enum
export interface IEnumAppNamespace extends RequiredFields<INamespace, 'enum'> {}
export interface IEnumServiceNamespace extends RequiredFields<INamespace, 'service' | 'enum'> {}
export interface IEnumEntityNamespace extends RequiredFields<INamespace, 'service' | 'entity' | 'enum'> {}
export interface IEnumTypeNamespace extends RequiredFields<INamespace, 'service' | 'entity' | 'types' | 'enum'> {}
export type IEnumNamespace = IEnumAppNamespace | IEnumServiceNamespace | IEnumEntityNamespace | IEnumTypeNamespace

// Method
export interface IMethodServiceNamespace extends RequiredFields<INamespace, 'service' | 'method'> {}
export interface IMethodEntityNamespace extends RequiredFields<INamespace, 'service' | 'entity' | 'method'> {}
export type IMethodNamespace = IMethodServiceNamespace | IMethodEntityNamespace
