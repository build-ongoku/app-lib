import { camelCase, capitalCase, pascalCase, snakeCase } from 'change-case'
import { RequiredFields } from '../utils/types'

/* * * * * *
 * Name
 * * * * * */
// TODO: Change AppV3 to use IName for all names e.g. field.name, entity.name etc.

export const acronyms = ['api', 'dal', 'http', 'https', 'id', 'jwt', 'sha', 'ui', 'url', 'usa', 'uuid']

interface IName {
    equal(other: IName): boolean
    equalString(other: string): boolean
    append(suffix: string): Name

    toRaw(): string
    toCapital(): string
    toSnake(): string
    toPascal(): string
    toCamel(): string

    toFieldName(): string
}

export class Name implements IName {
    raw: string // always store in snake case

    constructor(raw: string) {
        // Convert to snake case
        this.raw = snakeCase(raw)
    }

    equal(other: IName): boolean {
        return this.raw === other.toRaw()
    }

    equalString(other: string): boolean {
        return this.raw === snakeCase(other)
    }

    append(suffix: string): Name {
        // convert suffix to snake case
        return new Name(this.raw + '_' + snakeCase(suffix))
    }

    toRaw(): string {
        return this.raw
    }

    toCapital(): string {
        let str = capitalCase(this.raw)
        return capitalizeAcronyms(str)
    }

    toSnake(): string {
        return snakeCase(this.raw)
    }

    toPascal(): string {
        let str = pascalCase(this.raw)
        return capitalizeAcronyms(str)
    }

    toCamel(): string {
        let str = camelCase(this.raw)
        // Issue: camelCase handles `line_1` as `line_1` instead of `line1`, so we need to handle it manually
        // Replace `_<number>` with just the number
        str = str.replace(/_([0-9]+)/g, '$1')
        // Capitalize acronyms
        str = capitalizeAcronyms(str)
        return str
    }

    toFieldName(): string {
        return this.toCamel()
    }
}

const capitalizeAcronyms = (str: string): string => {
    acronyms.forEach((acronym) => {
        str = str.replace(pascalCase(acronym), acronym.toUpperCase())
    })
    return str
}

export const pluralize = (str: string): string => {
    // Have some overrides
    const overrides: { [key: string]: string } = {
        person: 'people',
        child: 'children',
        foot: 'feet',
        tooth: 'teeth',
        goose: 'geese',
    }
    // If there is an override, use it
    if (overrides[str]) {
        return overrides[str]
    }
    // If it ends with 's', 'x', 'z', 'ch', 'sh', add 'es'
    if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
        return str + 'es'
    }
    // If it ends with 'y' and the letter before 'y' is a consonant, replace 'y' with 'ies'
    if (str.endsWith('y') && !'aeiou'.includes(str[str.length - 2])) {
        return str.slice(0, -1) + 'ies'
    }
    // Otherwise, just add 's'
    return str + 's'
}

/* * * * * *
 * Interface: Primary Namespace + Namespace
 * * * * * */

// IPrimaryNamespace - has only the primary namespace properties and methods
// export interface IPrimaryNamespace {
//     raw: PrimaryNamespaceReq
//     toRaw(): PrimaryNamespaceReq
// }

// INamespace - has all the namespace properties and methods
export interface INamespace<NsReqT extends NamespaceReq> {
    raw: NsReqT
    service?: Name
    entity?: Name
    types?: Name[]
    enum?: Name
    method?: Name
    getTypeName(): Name
    toRaw(): NsReqT
    toString(): string
    toLabel(): string
    toURLPath(): string
    equal(other: INamespace<NsReqT>): boolean

    isService(): boolean
    isEntity(): boolean
    isType(): boolean
    isEnum(): boolean
    isMethod(): boolean
}

type NamespaceMethodKeys = 'toRaw' | 'toString' | 'toURLPath'

/* * * * * *
 * Request: Primary Namespace + Namespace
 * * * * * */

export interface NamespaceReq {
    service?: string
    entity?: string
    types?: string[]
    enum?: string
    method?: string
}

/* * * * * *
 * Classes: Primary Namespace + Namespace
 * * * * * */

// export class PrimaryNamespace implements IPrimaryNamespace {
//     service?: Name
//     entity?: Name
//     raw: PrimaryNamespaceReq

//     constructor(req: PrimaryNamespaceReq) {
//         this.raw = req
//         this.service = req.service ? new Name(req.service) : undefined
//         this.entity = req.entity ? new Name(req.entity) : undefined
//     }

//     toRaw(): PrimaryNamespaceReq {
//         return this.raw
//     }

//     toString(): string {
//         let str = '$'
//         if (this.service) {
//             str = str + `.service[${this.service}]`
//         }
//         if (this.entity) {
//             str = str + `.entity[${this.entity}]`
//         }
//         return str
//     }

//     toURLPath(): string {
//         let str = '/'
//         if (this.service) {
//             str = str + `${this.service}`
//         }
//         if (this.entity) {
//             str = str + `/${this.entity}`
//         }
//         return str
//     }
// }

export class Namespace<NsReqT extends NamespaceReq> implements INamespace<NsReqT> {
    raw: NsReqT
    service?: Name
    entity?: Name
    types?: Name[]
    enum?: Name
    method?: Name

    constructor(req: NsReqT) {
        // Store everything in snake case
        this.service = req.service ? new Name(req.service) : undefined
        this.entity = req.entity ? new Name(req.entity) : undefined
        this.raw = req
        if (req.types && req.types.length > 0) {
            this.types = req.types.map((type) => new Name(type))
        }
        this.enum = req.enum ? new Name(req.enum) : undefined
        this.method = req.method ? new Name(req.method) : undefined
    }

    toRaw(): NsReqT {
        return this.raw
    }

    getTypeName(): Name {
        if (!this.types || this.types.length === 0) {
            throw new Error('Namespace does not have types')
        }
        return this.types[0]
    }

    toString(): string {
        let str = '$'
        if (this.service) {
            str = str + `.service[${this.service.toSnake()}]`
        }
        if (this.entity) {
            str = str + `.entity[${this.entity.toSnake()}]`
        }
        if (this.types && this.types.length > 0) {
            str = str + `.types[${this.types.map((type) => type.toSnake()).join('.')}]`
        }
        if (this.enum) {
            str = str + `.enum[${this.enum.toSnake()}]`
        }
        if (this.method) {
            str = str + `.method[${this.method.toSnake()}]`
        }
        return str
    }

    toLabel(): string {
        const sep = ' - '
        let str = ''
        if (this.service) {
            str = str + this.service.toCapital()
        }
        if (this.entity) {
            str = str + `${sep}${this.entity.toCapital()}`
        }
        if (this.types && this.types.length > 0) {
            str = str + `${sep}${this.types.map((type) => type.toCapital()).join('.')}`
        }
        if (this.enum) {
            str = str + `${sep}${this.enum.toCapital()}`
        }
        if (this.method) {
            str = str + `${sep}${this.method.toCapital()}`
        }
        return str
    }

    toURLPath(): string {
        let str = '/'
        if (this.service) {
            str = str + this.service.toSnake()
        }
        if (this.entity) {
            str = str + `/` + this.entity.toSnake()
        }
        return str
    }

    equal(other: INamespace<NsReqT>): boolean {
        return this.toString() === other.toString()
    }

    isService(): boolean {
        // only service is defined
        return !!this.service && !this.entity && (!this.types || this.types.length == 0) && !this.enum && !this.method
    }
    isEntity(): boolean {
        // only service && entity is defined
        return !!this.service && !!this.entity && (!this.types || this.types.length == 0) && !this.enum && !this.method
    }
    isType(): boolean {
        // type is defined & no enum or method is defined (service & entity can be defined optionally)
        return !!this.types && this.types.length > 0 && !this.enum && !this.method
    }
    isEnum(): boolean {
        // enum is defined, and no method is defined (service, entity & types can be defined optionally)
        return !!this.enum && !this.method
    }
    isMethod(): boolean {
        // method is defined, no enum or type defined,  (service, entity can be defined optionally)
        return !!this.method && !this.enum && (!this.types || this.types.length == 0)
    }
}

/* * * * * *
 * INamespace - Variants
 * * * * * */

// Service
export interface IServiceNamespace extends INamespace<ServiceNamespaceReq> {}

// Entity
export interface IEntityNamespace extends INamespace<EntityNamespaceReq> {}

// Type
export interface ITypeAppNamespace extends INamespace<TypeAppNamespaceReq> {}
export interface ITypeServiceNamespace extends INamespace<TypeServiceNamespaceReq> {}
export interface ITypeEntityNamespace extends INamespace<TypeEntityNamespaceReq> {}
export type ITypeNamespace = ITypeAppNamespace | ITypeServiceNamespace | ITypeEntityNamespace

// Enum
export interface IEnumAppNamespace extends INamespace<EnumAppNamespaceReq> {}
export interface IEnumServiceNamespace extends INamespace<EnumServiceNamespaceReq> {}
export interface IEnumEntityNamespace extends INamespace<EnumEntityNamespaceReq> {}
export interface IEnumTypeNamespace extends INamespace<EnumTypeNamespaceReq> {}
export type IEnumNamespace = IEnumAppNamespace | IEnumServiceNamespace | IEnumEntityNamespace | IEnumTypeNamespace

// Method
export interface IMethodServiceNamespace extends INamespace<MethodServiceNamespaceReq> {}
export interface IMethodEntityNamespace extends INamespace<MethodEntityNamespaceReq> {}
export type IMethodNamespace = IMethodServiceNamespace | IMethodEntityNamespace

// const a: RequiredFields<INamespace<MethodServiceNamespaceReq>, 'service' | 'method'> = new Namespace<MethodServiceNamespaceReq>({ service: 'blah', method: 'get' })
// a.toURLPath()

// export type NamespaceVariant =
//     | IServiceNamespace
//     | IEntityNamespace
//     | ITypeAppNamespace
//     | ITypeServiceNamespace
//     | ITypeEntityNamespace
//     | IEnumAppNamespace
//     | IEnumServiceNamespace
//     | IEnumEntityNamespace
//     | IEnumTypeNamespace
//     | IMethodServiceNamespace
//     | IMethodEntityNamespace

/* * * * * *
 * Namespace Req - Variants
 * * * * * */

// Service
export interface ServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service'> {}

// Entity
export interface EntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity'> {}

// Type
export interface TypeAppNamespaceReq extends RequiredFields<NamespaceReq, 'types'> {}
export interface TypeServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'types'> {}
export interface TypeEntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'types'> {}
export type TypeNamespaceReq = TypeAppNamespaceReq | TypeServiceNamespaceReq | TypeEntityNamespaceReq

// Enum
export interface EnumAppNamespaceReq extends RequiredFields<NamespaceReq, 'enum'> {}
export interface EnumServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'enum'> {}
export interface EnumEntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'enum'> {}
export interface EnumTypeNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'types' | 'enum'> {}
export type EnumNamespaceReq = EnumAppNamespaceReq | EnumServiceNamespaceReq | EnumEntityNamespaceReq | EnumTypeNamespaceReq

// Method
export interface MethodServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'method'> {}
export interface MethodEntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'method'> {}
export type MethodNamespaceReq = MethodServiceNamespaceReq | MethodEntityNamespaceReq

// export type NamespaceReqVariant =
//     | ServiceNamespaceReq
//     | EntityNamespaceReq
//     | TypeAppNamespaceReq
//     | TypeServiceNamespaceReq
//     | TypeEntityNamespaceReq
//     | EnumAppNamespaceReq
//     | EnumServiceNamespaceReq
//     | EnumEntityNamespaceReq
//     | EnumTypeNamespaceReq
//     | MethodServiceNamespaceReq
//     | MethodEntityNamespaceReq

// /* * * * * *
//  * IToReq - Conversion
//  * * * * * */

// // IToReq - Convert I*Namespace to *NamespaceReq
// export type IToReq<T extends NamespaceVariant> =
//     // Specific Namespaces
//     // Method
//     T extends IMethodEntityNamespace
//         ? MethodEntityNamespaceReq
//         : T extends IMethodServiceNamespace
//         ? MethodServiceNamespaceReq
//         : // Enum
//         T extends IEnumTypeNamespace
//         ? EnumTypeNamespaceReq
//         : T extends IEnumEntityNamespace
//         ? EnumEntityNamespaceReq
//         : T extends IEnumServiceNamespace
//         ? EnumServiceNamespaceReq
//         : T extends IEnumAppNamespace
//         ? EnumAppNamespaceReq
//         : // Type
//         T extends ITypeEntityNamespace
//         ? TypeEntityNamespaceReq
//         : T extends ITypeServiceNamespace
//         ? TypeServiceNamespaceReq
//         : T extends ITypeAppNamespace
//         ? TypeAppNamespaceReq
//         : // Entity
//         T extends IEntityNamespace
//         ? EntityNamespaceReq
//         : // Service
//         T extends IServiceNamespace
//         ? ServiceNamespaceReq
//         : // More Generic Namespaces
//         T extends IMethodNamespace
//         ? MethodNamespaceReq
//         : T extends IEnumNamespace
//         ? EnumNamespaceReq
//         : T extends ITypeNamespace
//         ? TypeNamespaceReq
//         : T extends INamespace<infer NsReqT>
//         ? NsReqT
//         : never

// export type ReqToI<T extends NamespaceReqVariant> =
//     // Specific Requests
//     // Method
//     T extends MethodEntityNamespaceReq
//         ? IMethodEntityNamespace
//         : T extends MethodServiceNamespaceReq
//         ? IMethodServiceNamespace
//         : // Enum
//         T extends EnumTypeNamespaceReq
//         ? IEnumTypeNamespace
//         : T extends EnumEntityNamespaceReq
//         ? IEnumEntityNamespace
//         : T extends EnumServiceNamespaceReq
//         ? IEnumServiceNamespace
//         : T extends EnumAppNamespaceReq
//         ? IEnumAppNamespace
//         : // Type
//         T extends TypeEntityNamespaceReq
//         ? ITypeEntityNamespace
//         : T extends TypeServiceNamespaceReq
//         ? ITypeServiceNamespace
//         : T extends TypeAppNamespaceReq
//         ? ITypeAppNamespace
//         : // Entity
//         T extends EntityNamespaceReq
//         ? IEntityNamespace
//         : // Service
//         T extends ServiceNamespaceReq
//         ? IServiceNamespace
//         : // More Generic Namespaces
//         T extends MethodNamespaceReq
//         ? IMethodNamespace
//         : T extends EnumNamespaceReq
//         ? IEnumNamespace
//         : T extends TypeNamespaceReq
//         ? ITypeNamespace
//         : T extends NamespaceReq
//         ? INamespace<T>
//         : never
