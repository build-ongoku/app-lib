import { capitalCase } from 'change-case'
import { MetaFields } from '@ongoku/app-lib/src/common/field'
import { EnumKind, ForeignEntityKind, IFieldKind, NestedKind } from '@ongoku/app-lib/src/common/fieldkind'
import {
    ITypeNamespace,
    IEnumNamespace,
    IMethodNamespace,
    IServiceNamespace,
    IEntityNamespace,
    EntityNamespaceReq,
    Namespace,
    // IToReq,
    INamespace,
    ServiceNamespaceReq,
    ITypeEntityNamespace,
    IMethodEntityNamespace,
    Name,
    TypeNamespaceReq,
    EnumNamespaceReq,
    MethodNamespaceReq,
    TypeEntityNamespaceReq,
    MethodEntityNamespaceReq,
} from '@ongoku/app-lib/src/common/namespacev2'
import { MetaFieldKeys } from '@ongoku/app-lib/src/common/types'
import { GokuHTTPResponse, joinURL, makeRequestV2 } from '@ongoku/app-lib/src/providers/provider'

/* * * * * *
 * App
 * * * * * */

export interface IApp {
    getName(): Name
    getNameFriendly(): string

    services: IService[]
    entityInfos: IEntityInfo<any>[]
    typeInfos: ITypeInfo<ITypeNamespace>[]
    enums: IEnum[]
    methods: IMethod<IMethodNamespace>[]

    getService(namespace: ServiceNamespaceReq): Service
    getEntityInfo<E extends IEntityMinimal>(namespace: EntityNamespaceReq): EntityInfo<E> | undefined
    getServiceEntities(namespace: ServiceNamespaceReq): EntityInfo<any>[]
    getTypeInfo<T extends ITypeMinimal>(namespace: TypeNamespaceReq): TypeInfo<T>
    getEnum(namespace: EnumNamespaceReq): Enum
    getMethod(name: MethodNamespaceReq): Method<IMethodNamespace>

    getEntityMethods(namespace: IEntityNamespace): IMethod[]
}

export interface AppReq {
    name: Name
    services: ServiceReq[]
    entityInfos: EntityInfoReq[]
    typeInfos: TypeInfoReq[]
    enums: EnumReq[]
    methods: MethodReq[]
}

export class App implements IApp {
    name: Name

    services: Service[] = []
    entityInfos: EntityInfo<any>[] = []
    typeInfos: TypeInfo<any>[] = []
    enums: Enum[] = []
    methods: Method<IMethodNamespace>[] = []

    servicesMap: Record<string, Service> = {}
    entitiesMap: Record<string, EntityInfo<any>> = {}
    typesMap: Record<string, TypeInfo<any>> = {}
    enumsMap: Record<string, Enum> = {}
    methodsMap: Record<string, Method<IMethodNamespace>> = {}

    constructor(req: AppReq) {
        this.name = req.name

        req.services.forEach((elem) => {
            this.services.push(new Service(elem))
        })
        req.entityInfos.forEach((elem) => {
            this.entityInfos.push(new EntityInfo(elem))
        })
        req.typeInfos.forEach((elem) => {
            this.typeInfos.push(new TypeInfo(elem))
        })
        req.enums.forEach((elem) => {
            this.enums.push(new Enum(elem))
        })
        req.methods.forEach((elem) => {
            this.methods.push(new Method(elem))
        })

        this.services.forEach((elem) => {
            this.servicesMap[elem.namespace.toString()] = elem
        })
        this.entityInfos.forEach((elem) => {
            this.entitiesMap[elem.namespace.toString()] = elem
        })
        this.typeInfos.forEach((elem) => {
            this.typesMap[elem.namespace.toString()] = elem
        })
        this.enums.forEach((elem) => {
            this.enumsMap[elem.namespace.toString()] = elem
        })
        this.methods.forEach((elem) => {
            this.methodsMap[elem.namespace.toString()] = elem
        })
    }

    getName(): Name {
        return this.name
    }

    getNameFriendly(): string {
        return capitalCase(this.name.toCapital())
    }

    getService(nsReq: ServiceNamespaceReq): Service {
        const ns = new Namespace(nsReq)
        return this.servicesMap[ns.toString()]
    }

    getEntityInfo<E extends IEntityMinimal>(nsReq: EntityNamespaceReq): EntityInfo<E> | undefined {
        const ns = new Namespace(nsReq)
        const key = ns.toString()
        const ret = this.entitiesMap[ns.toString()]
        return ret
    }

    getServiceEntities(nsReq: ServiceNamespaceReq): EntityInfo<any>[] {
        const ns = new Namespace(nsReq)
        return this.entityInfos.filter((ent) => ent.namespace.service!.equal(ns.service!))
    }

    getTypeInfo<T extends ITypeMinimal>(nsReq: TypeNamespaceReq): TypeInfo<T> {
        const ns = new Namespace(nsReq)
        console.log('[App] [getTypeInfo] [ns]', 'namespace', ns.toString(), 'typesMap', this.typesMap)
        return this.typesMap[ns.toString()]
    }

    getEnum(nsReq: EnumNamespaceReq): Enum {
        const ns = new Namespace(nsReq)
        return this.enumsMap[ns.toString()]
    }

    getMethod(nsReq: MethodNamespaceReq): Method<IMethodNamespace> {
        const ns = new Namespace(nsReq)
        const searchTerm = ns.toString()
        const mthd = this.methodsMap[searchTerm]
        if (!mthd) {
            throw new Error(`Method not found: ${searchTerm}`)
        }
        return mthd
    }

    getEntityMethods(entNs: IEntityNamespace): IMethod[] {
        // Loop through all the methods and return the ones that match the entity namespace

        return this.methods.filter((m) => {
            if (m.namespace.service !== entNs.service) {
                return false
            }
            {
                // If the type of m IMethodEntityNamespace?
                const mUnsafe = m as Method<IMethodEntityNamespace>
                if (mUnsafe.namespace.entity && mUnsafe.namespace.entity !== entNs.entity) {
                    return false
                }
            }
            return true
        })
    }
}

/* * * * * *
 * Service
 * * * * * */

interface IService {
    namespace: IServiceNamespace
    getName(): Name
    getNameFriendly(): string
}

export interface ServiceReq {
    namespace: ServiceNamespaceReq
}

export class Service implements IService {
    namespace: IServiceNamespace

    constructor(req: ServiceReq) {
        this.namespace = new Namespace(req.namespace)
        if (!this.namespace.service) {
            throw new Error('Service name is required')
        }
    }

    getName(): Name {
        return this.namespace.service!
    }

    getNameFriendly(): string {
        return this.namespace.service!.toCapital()
    }
}

/* * * * * *
 * Type
 * * * * * */

export interface ITypeMinimal {}

/* * * * * *
 * Type Info
 * * * * * */

interface ITypeInfo<T extends ITypeMinimal = any> {
    namespace: ITypeNamespace
    fields: IField[]
    getField(name: string): IField
    getTypeName(r: T): string
    getEmptyObject(): Omit<T, MetaFieldKeys>
}

export interface TypeInfoReq<T extends ITypeMinimal = any> {
    namespace: TypeNamespaceReq
    fields: FieldReq[]
    getEmptyObjectFunc?: () => Omit<T, MetaFieldKeys>
}

export class TypeInfo<T extends ITypeMinimal = any> implements ITypeInfo<T> {
    namespace: ITypeNamespace
    fields: Field[] = []
    fieldsMap: Record<string, Field> = {}

    constructor(req: TypeInfoReq<T>) {
        this.namespace = new Namespace(req.namespace)
        this.fields = req.fields.map((f) => new Field<any, T>(f))
        this.fields.forEach((f) => {
            this.fieldsMap[f.name.toRaw()] = f
        })
    }

    getField(name: string): IField {
        return this.fieldsMap[name]
    }

    getTypeName(r: any): string {
        return r.id
    }

    getEmptyObject(): Omit<T, MetaFieldKeys> {
        return this.getEmptyObjectFunc()
    }

    getEmptyObjectFunc = (): Omit<T, MetaFieldKeys> => {
        return {} as T
    }
}

/* * * * * *
 * Type Field
 * * * * * */

interface IField<T = any, ParentT = any> {
    name: Name
    dtype: IDtype<T>
    isRepeated?: boolean
    isOptional?: boolean
    isMetaField?: boolean
    getLabel(): string
    getFieldValue(obj: ParentT): T
}

export interface FieldReq<T = any, ParentT = any> {
    name: Name
    dtype: DtypeReq<T>
    isRepeated?: boolean
    isMetaField?: boolean
    excludeFromForm?: boolean
    isOptional?: boolean
}

export class Field<T = any, ParentT = any> implements IField<T, ParentT> {
    name: Name
    dtype: IDtype<T>
    isRepeated?: boolean
    isMetaField?: boolean
    excludeFromForm?: boolean
    isOptional?: boolean | undefined

    constructor(req: FieldReq<T>) {
        this.name = req.name
        this.dtype = new Dtype<T>(req.dtype)
        this.isRepeated = req.isRepeated
        this.isMetaField = req.isMetaField
        this.excludeFromForm = req.excludeFromForm
        this.isOptional = req.isOptional
    }

    getLabel(): string {
        return this.getLabelFunc(this)
    }
    // Default (Overidable)
    getLabelFunc = (field: Field<T, ParentT>): string => {
        return field.name.toCapital()
    }

    getFieldValue(obj: ParentT): T {
        // Loop though all the fields in the object and get the value for this field
        const _obj: any = obj
        return _obj[this.name.toFieldName()] as T
    }
}

/* * * * * *
 * Type Field Dtype
 * * * * * */

interface IDtype<T = any> {
    name: Name
    kind: IFieldKind
    namespace?: IEntityNamespace | ITypeNamespace | IEnumNamespace
}

// TypeToNamespace is a type that takes a type and returns the namespace type.
// If T is Entity, then it returns IEntityNamespace.
// If T is Type, then it returns ITypeNamespace.
// Otherwise it returns IEnumNamespace or undefined. There is not way to detect if T is an Enum.
// type TypeToNamespace<T> = T extends ITypeMinimal ? ITypeNamespace : T extends IEntityMinimal ? IEntityNamespace : IEnumNamespace | INamespace | undefined

export interface DtypeReq<T = any> {
    name: Name
    kind: IFieldKind
    namespace?: EntityNamespaceReq | TypeNamespaceReq | EnumNamespaceReq
}

class Dtype<T = any> implements IDtype {
    name: Name
    kind: IFieldKind
    namespace?: IEntityNamespace | ITypeNamespace | IEnumNamespace

    constructor(req: DtypeReq) {
        this.name = req.name
        this.kind = req.kind
        if (req.namespace) {
            this.namespace = new Namespace(req.namespace) as IEntityNamespace | ITypeNamespace | IEnumNamespace
        }
        if (this.kind === EnumKind) {
            if (!this.namespace) {
                throw new Error('Enum field does not have a reference namespace')
            }
            if (!this.namespace.enum) {
                throw new Error('Enum field does not have a reference enum')
            }
        }
        if (this.kind === NestedKind) {
            if (!this.namespace) {
                throw new Error('Nested field does not have a reference namespace')
            }
            if (!this.namespace.types || this.namespace.types.length === 0) {
                throw new Error('Nested field does not have a reference type')
            }
        }
        if (this.kind === ForeignEntityKind) {
            if (!this.namespace) {
                throw new Error('ForeignEntity field does not have a reference namespace')
            }
            if (!this.namespace.entity) {
                throw new Error('ForeignEntity field does not have a reference entity')
            }
        }
    }
}

/* * * * * *
 * Entity
 * * * * * */

export interface IEntityMinimal extends ITypeMinimal, MetaFields {}

/* * * * * *
 * Entity Info
 * * * * * */

interface IEntityInfo<E extends IEntityMinimal> {
    namespace: IEntityNamespace
    actions: IEntityAction[]
    associations: IEntityAssociation[]
    getTypeNamespace(): ITypeEntityNamespace
    getName(): Name
    getNameFriendly(): string
    getEntityName(r: E): string
    getEntityNameFriendly(r: E): string
}

export interface EntityInfoReq<E extends IEntityMinimal = any> {
    namespace: EntityNamespaceReq
    actions: EntityActionReq[]
    associations: EntityAssociationReq[]
}

export class EntityInfo<E extends IEntityMinimal> implements IEntityInfo<E> {
    namespace: IEntityNamespace
    associations: IEntityAssociation[] = []
    actions: EntityAction[] = []

    constructor(req: EntityInfoReq) {
        this.namespace = new Namespace(req.namespace) as IEntityNamespace
        req.actions.forEach((elem) => {
            this.actions.push(new EntityAction(elem))
        })
        req.associations.forEach((elem) => {
            this.associations.push(new EntityAssociation(elem))
        })
        if (!this.namespace.service || !this.namespace.entity) {
            throw new Error('Service and Entity name is required')
        }
    }

    getTypeNamespace(): ITypeEntityNamespace {
        // Take the entity namespace and add the type to it
        const ns = new Namespace({ service: this.namespace.service!.toRaw(), entity: this.namespace.entity!.toRaw(), types: [this.namespace.entity!.toRaw()] })
        return ns as ITypeEntityNamespace
    }

    getName(): Name {
        return this.namespace.entity!
    }

    getNameFriendly(): string {
        return this.funcGetNameFriendly(this)
    }
    // Default (Overidable)
    funcGetNameFriendly = (info: EntityInfo<E>): string => {
        console.log('[EntityInfo] [funcGetNameFriendly] [default] called')
        return info.getName().toCapital()
    }

    getEntityName(r: E): string {
        return this.funcGetEntityName(r, this)
    }
    // Default (Overidable)
    funcGetEntityName = function (r: E, info: EntityInfo<E>): string {
        const _r: any = r
        if (_r.name) {
            // Simple string name
            if (typeof _r.name === 'string') {
                return _r.name
            }
            // Person Name (First + Last)
            if (_r.name.firstName && _r.name.lastName) {
                return `${_r.name.firstName} ${_r.name.lastName}`
            }
        }
        return r.id
    }

    getEntityNameFriendly(r: E): string {
        return this.funcGetEntityNameFriendly(r, this)
    }
    // Default (Overidable)
    funcGetEntityNameFriendly = function (r: E, info: EntityInfo<E>): string {
        return info.getEntityName(r)
    }
}

/* * * * * *
 * Entity Association
 * * * * * */

interface IEntityAssociation {
    relationship: 'child_of' | 'parent_of'
    type: 'one' | 'many'
    entityNamespace: IEntityNamespace
    name: Name
    otherAssociationName?: Name
}

export interface EntityAssociationReq {
    relationship: 'child_of' | 'parent_of'
    type: 'one' | 'many'
    entityNamespace: EntityNamespaceReq
    name: Name
    otherAssociationName?: Name
}

export class EntityAssociation implements IEntityAssociation {
    relationship: 'child_of' | 'parent_of'
    type: 'one' | 'many'
    entityNamespace: IEntityNamespace
    name: Name
    otherAssociationName?: Name

    constructor(req: EntityAssociationReq) {
        this.relationship = req.relationship
        this.type = req.type
        this.entityNamespace = new Namespace(req.entityNamespace)
        this.name = req.name
        this.otherAssociationName = req.otherAssociationName
    }
}

/* * * * * *
 * Entity Action
 * * * * * */

interface IEntityAction {
    name: Name
    getLabel(): string
    methodNamespace: IMethodEntityNamespace
}

interface EntityActionReq {
    name: Name
    methodNamespace: MethodEntityNamespaceReq
}

class EntityAction implements IEntityAction {
    name: Name
    methodNamespace: IMethodEntityNamespace

    constructor(req: EntityActionReq) {
        this.name = req.name
        this.methodNamespace = new Namespace(req.methodNamespace)
    }

    getLabel(): string {
        return this.name.toCapital()
    }
}

/* * * * * *
 * Enum
 * * * * * */

interface IEnum {
    namespace: IEnumNamespace
    values: IEnumValue[]
}

export interface EnumReq {
    namespace: EnumNamespaceReq
    values: EnumValueReq[]
}

export class Enum implements IEnum {
    namespace: IEnumNamespace
    values: IEnumValue[] = []

    constructor(req: EnumReq) {
        this.namespace = new Namespace(req.namespace)
        req.values.forEach((elem) => {
            this.values.push(new EnumValue(elem))
        })
        if (!this.namespace.enum) {
            throw new Error('Enum namespace does not have a reference enum')
        }
    }
}

/* * * * * *
 * Enum Values
 * * * * * */

interface IEnumValue {
    id: number
    value: string
    description?: string
    getDisplayValue(): string
}

export interface EnumValueReq {
    id: number
    value: string
    description?: string
    displayValue?: string
}

export class EnumValue implements IEnumValue {
    id: number
    value: string
    description?: string
    displayValue?: string

    constructor(req: EnumValueReq) {
        this.id = req.id
        this.value = req.value
        this.description = req.description
        this.displayValue = req.displayValue
    }

    getDisplayValue(): string {
        return this.displayValue || capitalCase(this.value)
    }
}

/* * * * * *
 * Method
 * * * * * */

interface IMethod<reqT = any, resT = any> {
    namespace: IMethodNamespace
    apis: IMethodAPI[]
    requestTypeNamespace?: ITypeNamespace
    responseTypeNamespace: ITypeNamespace
    getAPIEndpoint(): string
    makeAPIRequest(req: reqT): Promise<GokuHTTPResponse<resT>>
}

export interface MethodReq {
    namespace: MethodNamespaceReq
    requestTypeNamespace?: TypeNamespaceReq
    responseTypeNamespace: TypeNamespaceReq
    apis: IMethodAPI[]
}

export class Method<reqT = any, resT = any> implements IMethod<reqT, resT> {
    namespace: IMethodNamespace
    requestTypeNamespace?: ITypeNamespace
    responseTypeNamespace: ITypeNamespace
    apis: IMethodAPI[]

    constructor(req: MethodReq) {
        this.namespace = new Namespace(req.namespace) as IMethodNamespace
        if (req.requestTypeNamespace) {
            this.requestTypeNamespace = new Namespace(req.requestTypeNamespace)
        }
        this.responseTypeNamespace = new Namespace(req.responseTypeNamespace)
        this.apis = req.apis

        if (!this.namespace.service || !this.namespace.method) {
            throw new Error('Service and Method name is required')
        }
    }

    getAPIEndpoint(): string {
        if (this.apis.length === 0) {
            throw new Error('No API found for method')
        }
        const api = this.apis[0]
        return joinURL('v' + api.version, this.namespace.toURLPath(), api.path)
    }

    makeAPIRequest<ReqT = any, RespT = any>(req: ReqT): Promise<GokuHTTPResponse<RespT>> {
        console.debug('[Method] [makeAPIRequest]', 'namespace', this.namespace.toString(), 'req', req)
        const api = this.apis[0]
        const relPath = joinURL('v' + api.version, this.namespace.toURLPath(), api.path)
        return makeRequestV2<RespT>({ relativePath: relPath, method: api.method, data: req })
    }
}

/* * * * * *
 * Method - API
 * * * * * */

interface IMethodAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    version: number
}
