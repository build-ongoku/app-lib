import { capitalCase } from 'change-case'
import { MetaFields } from '@ongoku/app-lib/src/common/field'
import { IFieldKind } from '@ongoku/app-lib/src/common/fieldkind'
import {
    ITypeNamespace,
    IEnumNamespace,
    IMethodNamespace,
    IServiceNamespace,
    IEntityNamespace,
    IServicePrimaryNamespace,
    EntityNamespaceReq,
    Namespace,
    PrimaryNamespace,
    IToReq,
    INamespace,
    ServiceNamespaceReq,
    ITypeEntityNamespace,
    IMethodEntityNamespace,
} from './namespacev2'
import { MetaFieldKeys } from '@ongoku/app-lib/src/common/types'
import { GokuHTTPResponse, joinURL, makeRequestV2 } from '@ongoku/app-lib/src/providers/provider'

/* * * * * *
 * App
 * * * * * */

export interface IApp {
    getName(): string
    getNameFriendly(): string

    services: IService[]
    entityInfos: IEntityInfo<any>[]
    typeInfos: ITypeInfo<ITypeNamespace>[]
    enums: IEnum<IEnumNamespace>[]
    methods: IMethod<IMethodNamespace>[]

    getService(namespace: IServiceNamespace): Service
    getEntityInfo<E extends IEntityMinimal>(namespace: IEntityNamespace): EntityInfo<E> | undefined
    getTypeInfo<T extends ITypeMinimal>(namespace: ITypeNamespace): TypeInfo<T>
    getEnum(namespace: IEnumNamespace): Enum<IEnumNamespace>
    getMethod(name: IMethodNamespace): Method<IMethodNamespace>

    getEntityMethods(namespace: IEntityNamespace): IMethod[]
}

export interface AppReq {
    name: string
    services: ServiceReq[]
    entityInfos: EntityInfoReq[]
    typeInfos: TypeInfoReq[]
    enums: EnumReq[]
    methods: MethodReq[]
}

export class App implements IApp {
    name: string

    services: Service[] = []
    entityInfos: EntityInfo<any>[] = []
    typeInfos: TypeInfo<any, ITypeNamespace>[] = []
    enums: Enum<IEnumNamespace>[] = []
    methods: Method<IMethodNamespace>[] = []

    servicesMap: Record<string, Service> = {}
    entitiesMap: Record<string, EntityInfo<any>> = {}
    typesMap: Record<string, TypeInfo<any, ITypeNamespace>> = {}
    enumsMap: Record<string, Enum<IEnumNamespace>> = {}
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

    getName(): string {
        return this.name
    }

    getNameFriendly(): string {
        return capitalCase(this.getName())
    }

    getService(nsReq: ServiceNamespaceReq): Service {
        const ns = new PrimaryNamespace(nsReq)
        return this.servicesMap[ns.toString()]
    }

    getEntityInfo<E extends IEntityMinimal>(nsReq: EntityNamespaceReq): EntityInfo<E> | undefined {
        const ns = new PrimaryNamespace(nsReq)
        return this.entitiesMap[ns.toString()]
    }

    getTypeInfo<T extends ITypeMinimal>(nsReq: ITypeNamespace): TypeInfo<T, ITypeNamespace> {
        const ns = new Namespace(nsReq)
        console.log('[App] [getTypeInfo] [ns]', 'namespace', ns.toString(), 'typesMap', this.typesMap)
        return this.typesMap[ns.toString()]
    }

    getEnum(nsReq: IEnumNamespace): Enum<IEnumNamespace> {
        const ns = new Namespace(nsReq)
        return this.enumsMap[ns.toString()]
    }

    getMethod(nsReq: IMethodNamespace): Method<IMethodNamespace> {
        const ns = new Namespace(nsReq)
        return this.methodsMap[ns.toString()]
    }

    getEntityMethods(nsReq: IEntityNamespace): IMethod[] {
        // Loop through all the methods and return the ones that match the entity namespace
        return this.methods.filter((m) => {
            return m.namespace.service === nsReq.service && m.namespace.entity === nsReq.entity
        })
    }
}

/* * * * * *
 * Service
 * * * * * */

interface IService {
    namespace: IServicePrimaryNamespace
    getName(): string
    getNameFriendly(): string
}

export interface ServiceReq {
    namespace: IToReq<IServiceNamespace>
}

export class Service implements IService {
    namespace: IServiceNamespace

    constructor(req: ServiceReq) {
        this.namespace = new PrimaryNamespace(req.namespace) as IServiceNamespace
    }

    getName(): string {
        return this.namespace.service
    }

    getNameFriendly(): string {
        return capitalCase(this.getName())
    }
}

/* * * * * *
 * Type
 * * * * * */

export interface ITypeMinimal {}

/* * * * * *
 * Type Info
 * * * * * */

interface ITypeInfo<T extends ITypeMinimal = any, NamespaceT extends ITypeNamespace = ITypeNamespace> {
    namespace: NamespaceT
    fields: IField[]
    getField(name: string): IField
    getTypeName(r: T): string
    getEmptyObject(): Omit<T, MetaFieldKeys>
}

export interface TypeInfoReq<T extends ITypeMinimal = any, NamespaceT extends ITypeNamespace = ITypeNamespace> {
    namespace: IToReq<NamespaceT>
    fields: FieldReq[]
    getEmptyObjectFunc?: () => Omit<T, MetaFieldKeys>
}

export class TypeInfo<T extends ITypeMinimal = any, NamespaceT extends ITypeNamespace = ITypeNamespace> implements ITypeInfo<T, NamespaceT> {
    namespace: NamespaceT
    fields: Field[] = []
    fieldsMap: Record<string, Field> = {}

    constructor(req: TypeInfoReq<T, NamespaceT>) {
        this.namespace = new Namespace(req.namespace) as NamespaceT
        this.fields = req.fields.map((f) => new Field<any, T>(f))
        this.fields.forEach((f) => {
            this.fieldsMap[f.name] = f
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
    name: string
    dtype: IDtype<T>
    isRepeated?: boolean
    isOptional?: boolean
    isMetaField?: boolean
    getLabel(): string
    getFieldValue(obj: ParentT): T
}

export interface FieldReq<T = any, ParentT = any> {
    name: string
    dtype: DtypeReq<T>
    isRepeated?: boolean
    isMetaField?: boolean
    isOptional?: boolean
}

export class Field<T = any, ParentT = any> implements IField<T, ParentT> {
    name: string
    dtype: IDtype<T>
    isRepeated?: boolean
    isMetaField?: boolean
    isOptional?: boolean | undefined

    constructor(req: FieldReq<T>) {
        this.name = req.name
        this.dtype = new Dtype(req.dtype)
        this.isRepeated = req.isRepeated
        this.isMetaField = req.isMetaField
        this.isOptional = req.isOptional
    }

    getLabel(): string {
        return this.getLabelFunc(this)
    }
    // Default (Overidable)
    getLabelFunc = (field: Field<T, ParentT>): string => {
        return capitalCase(field.name)
    }

    getFieldValue(obj: ParentT): T {
        // Loop though all the fields in the object and get the value for this field
        const _obj: any = obj
        return _obj[this.name] as T
    }
}

/* * * * * *
 * Type Field Dtype
 * * * * * */

interface IDtype<T = any> {
    name: string
    kind: IFieldKind
    namespace?: TypeToNamespace<T>
}

// TypeToNamespace is a type that takes a type and returns the namespace type.
// If T is Entity, then it returns IEntityNamespace.
// If T is Type, then it returns ITypeNamespace.
// Otherwise it returns IEnumNamespace or undefined. There is not way to detect if T is an Enum.
type TypeToNamespace<T> = T extends ITypeMinimal ? ITypeNamespace : T extends IEntityMinimal ? IEntityNamespace : IEnumNamespace | INamespace | undefined

export interface DtypeReq<T = any> {
    name: string
    kind: IFieldKind
    namespace?: TypeToNamespace<T> extends PrimaryNamespace ? IToReq<TypeToNamespace<T>> : IToReq<IEnumNamespace> | IToReq<INamespace> | undefined
}

class Dtype<T = any> implements IDtype {
    name: string
    kind: IFieldKind
    namespace?: TypeToNamespace<T>

    constructor(req: DtypeReq) {
        this.name = req.name
        this.kind = req.kind
        if (req.namespace) {
            this.namespace = new Namespace(req.namespace) as TypeToNamespace<T>
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
    getTypeNamespace(): ITypeEntityNamespace
    getName(): string
    getNameFriendly(): string
    getEntityName(r: E): string
    getEntityNameFriendly(r: E): string
}

export interface EntityInfoReq<E extends IEntityMinimal = any> {
    namespace: IToReq<IEntityNamespace>
    actions: EntityActionReq[]
}

export class EntityInfo<E extends IEntityMinimal> implements IEntityInfo<E> {
    namespace: IEntityNamespace
    actions: EntityAction[] = []

    constructor(req: EntityInfoReq) {
        this.namespace = new PrimaryNamespace(req.namespace) as IEntityNamespace
        req.actions.forEach((elem) => {
            this.actions.push(new EntityAction(elem))
        })
    }

    getTypeNamespace(): ITypeEntityNamespace {
        // Take the entity namespace and add the type to it
        const ns = new Namespace({ service: this.namespace.service, entity: this.namespace.entity, types: [this.namespace.entity] })
        return ns as ITypeEntityNamespace
    }

    getName(): string {
        return this.funcGetName(this)
    }
    // Default (Overidable)
    funcGetName = function (info: EntityInfo<E>): string {
        return info.namespace.entity
    }

    getNameFriendly(): string {
        return this.funcGetNameFriendly(this)
    }
    // Default (Overidable)
    funcGetNameFriendly = (info: EntityInfo<E>): string => {
        console.log('[EntityInfo] [funcGetNameFriendly] [default] called')
        return capitalCase(info.getName())
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
            if (_r.name.first_name && _r.name.last_name) {
                return `${_r.name.first_name} ${_r.name.last_name}`
            }
        }
        return r.id
    }

    getEntityNameFriendly(r: E): string {
        return this.funcGetEntityNameFriendly(r, this)
    }
    // Default (Overidable)
    funcGetEntityNameFriendly = function (r: E, info: EntityInfo<E>): string {
        return capitalCase(info.getEntityName(r))
    }
}

/* * * * * *
 * Entity Action
 * * * * * */

interface IEntityAction {
    name: string
    getLabel(): string
    methodNamespace: IMethodEntityNamespace
}

interface EntityActionReq {
    name: string
    methodNamespace: IToReq<IMethodEntityNamespace>
}

class EntityAction implements IEntityAction {
    name: string
    methodNamespace: IMethodEntityNamespace

    constructor(req: EntityActionReq) {
        this.name = req.name
        this.methodNamespace = new Namespace(req.methodNamespace) as IMethodEntityNamespace
    }

    getLabel(): string {
        return capitalCase(this.name)
    }
}

/* * * * * *
 * Enum
 * * * * * */

interface IEnum<NamespaceT extends IEnumNamespace = IEnumNamespace> {
    namespace: NamespaceT
    values: IEnumValue[]
}

export interface EnumReq<NamespaceT extends IEnumNamespace = IEnumNamespace> {
    namespace: IToReq<NamespaceT>
    values: EnumValueReq[]
}

export class Enum<NamespaceT extends IEnumNamespace> implements IEnum<NamespaceT> {
    namespace: NamespaceT
    values: IEnumValue[] = []

    constructor(req: EnumReq<NamespaceT>) {
        this.namespace = new Namespace(req.namespace) as NamespaceT
        req.values.forEach((elem) => {
            this.values.push(new EnumValue(elem))
        })
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

interface IMethod<NamespaceT extends IMethodNamespace = IMethodNamespace, reqT = any, resT = any> {
    namespace: NamespaceT
    apis: IMethodAPI[]
    requestTypeNamespace?: ITypeNamespace
    responseTypeNamespace: ITypeNamespace
    makeAPIRequest(req: reqT): Promise<GokuHTTPResponse<resT>>
}

export interface MethodReq<NamespaceT extends IMethodNamespace = IMethodNamespace> {
    namespace: IToReq<NamespaceT>
    requestTypeNamespace?: IToReq<ITypeNamespace>
    responseTypeNamespace: IToReq<ITypeNamespace>
    apis: IMethodAPI[]
}

export class Method<NamespaceT extends IMethodNamespace = IMethodNamespace, reqT = any, resT = any> implements IMethod<NamespaceT, reqT, resT> {
    namespace: NamespaceT
    requestTypeNamespace?: ITypeNamespace
    responseTypeNamespace: ITypeNamespace
    apis: IMethodAPI[]

    constructor(req: MethodReq<NamespaceT>) {
        this.namespace = new Namespace(req.namespace) as NamespaceT
        if (req.requestTypeNamespace) {
            this.requestTypeNamespace = new Namespace(req.requestTypeNamespace) as ITypeNamespace
        }
        this.responseTypeNamespace = new Namespace(req.responseTypeNamespace) as ITypeNamespace
        this.apis = req.apis
    }

    makeAPIRequest<ReqT = any, RespT = any>(req: ReqT): Promise<GokuHTTPResponse<RespT>> {
        console.debug('[Method] [makeAPIRequest]', 'namespace', this.namespace.toString(), 'req', req)
        if (this.apis.length === 0) {
            throw new Error('No API found for method')
        }
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
