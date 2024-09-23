// import { capitalCase } from 'change-case'
// import { FieldKind } from './Field'

// /* * * * * *
//  * App
//  * * * * * */

// export interface IApp extends IWithServices, IWithTypes<ITypeAppNamespace>, IWithEnums<IEnumAppNamespace> {
//     getName(): string
//     getNameFriendly(): string
// }

// interface AppReq {
//     withServices: WithServicesReq
//     withTypes: WithTypesReq<ITypeAppNamespace>
//     withEnums: WithEnumsReq<IEnumAppNamespace>
// }

// export class App implements IApp {
//     services: WithServices
//     types: WithTypes<ITypeAppNamespace>
//     enums: WithEnums<IEnumAppNamespace>

//     constructor(req: AppReq) {
//         this.services = new WithServices(req.withServices)
//         this.types = new WithTypes(req.withTypes)
//         this.enums = new WithEnums(req.withEnums)
//     }

//     getName(): string {
//         return 'app'
//     }

//     getNameFriendly(): string {
//         return 'App'
//     }

//     // IWithServices
//     getService(namespace: IServiceNamespace): IService {
//         return this.services.getService(namespace)
//     }

//     // IWithTypes
//     getType(namespace: ITypeAppNamespace): IType<ITypeAppNamespace> {
//         return this.types.getType(namespace)
//     }

//     // IWithEnums
//     getEnum(namespace: IEnumAppNamespace): IEnum<IEnumAppNamespace> {
//         return this.enums.getEnum(namespace)
//     }
// }

// /* * * * * *
//  * Service
//  * * * * * */

// interface IService extends IWithEntities, IWithTypes<ITypeServiceNamespace>, IWithMethods<IMethodServiceNamespace> {
//     namespace: IServiceNamespace
//     getName(): string
//     getNameFriendly(): string
// }

// interface ServiceReq {
//     namespace: IServiceNamespace
//     withEntities: WithEntitiesReq
//     withTypes: WithTypesReq<ITypeServiceNamespace>
//     withMethods: WithMethodsReq<IMethodServiceNamespace>
// }

// export class Service implements IService {
//     namespace: IServiceNamespace
//     entities: WithEntities
//     types: WithTypes<ITypeServiceNamespace>
//     methods: WithMethods<IMethodServiceNamespace>

//     constructor(req: ServiceReq) {
//         this.namespace = req.namespace
//         this.entities = new WithEntities(req.withEntities)
//         this.types = new WithTypes(req.withTypes)
//         this.methods = new WithMethods(req.withMethods)
//     }

//     getName(): string {
//         return this.namespace.service
//     }

//     getNameFriendly(): string {
//         return capitalCase(this.getName())
//     }

//     // IWithEntities
//     getEntity(namespace: IEntityNamespace): IEntity {
//         return this.entities.getEntity(namespace)
//     }

//     // IWithTypes
//     getType(namespace: ITypeServiceNamespace): IType<ITypeServiceNamespace> {
//         return this.types.getType(namespace)
//     }

//     // IWithMethods
//     getMethod(name: string): IMethod<IMethodServiceNamespace> {
//         return this.methods.getMethod(name)
//     }
// }

// /* * * * * *
//  * Entity
//  * * * * * */

// interface IEntity extends IWithTypes<ITypeEntityNamespace>, IWithEnums<IEnumEntityNamespace>, IWithMethods<IMethodEntityNamespace> {
//     namespace: IEntityNamespace
//     getName(): string
//     getNameFriendly(): string
// }

// interface EntityReq {
//     namespace: IEntityNamespace
//     withTypes: WithTypesReq<ITypeEntityNamespace>
//     withEnums: WithEnumsReq<IEnumEntityNamespace>
//     withMethods: WithMethodsReq<IMethodEntityNamespace>
// }

// export class Entity implements IEntity {
//     namespace: IEntityNamespace
//     types: WithTypes<ITypeEntityNamespace>
//     enums: WithEnums<IEnumEntityNamespace>
//     methods: WithMethods<IMethodEntityNamespace>

//     constructor(req: EntityReq) {
//         this.namespace = req.namespace
//         this.types = new WithTypes(req.withTypes)
//         this.enums = new WithEnums(req.withEnums)
//         this.methods = new WithMethods(req.withMethods)
//     }

//     getName(): string {
//         return this.namespace.entity
//     }

//     getNameFriendly(): string {
//         return capitalCase(this.getName())
//     }

//     // IWithTypes
//     getType(namespace: ITypeEntityNamespace): IType<ITypeEntityNamespace> {
//         return this.types.getType(namespace)
//     }

//     // IWithEnums
//     getEnum(namespace: IEnumEntityNamespace): IEnum<IEnumEntityNamespace> {
//         return this.enums.getEnum(namespace)
//     }

//     // IWithMethods
//     getMethod(name: string): IMethod<IMethodEntityNamespace> {
//         return this.methods.getMethod(name)
//     }
// }

// /* * * * * *
//  * Type
//  * * * * * */

// interface IType<NamespaceT extends ITypeNamespace> extends IWithEnums<IEnumTypeNamespace> {
//     namespace: NamespaceT
//     fields: Record<string, IField>
//     getField(name: string): IField
// }

// interface TypeReq<NamespaceT extends ITypeNamespace> {
//     namespace: NamespaceT
//     fields: IField[]
//     withEnums: WithEnumsReq<IEnumTypeNamespace>
// }

// export class Type<NamespaceT extends ITypeNamespace> implements IType<NamespaceT> {
//     namespace: NamespaceT
//     fields: Record<string, IField> = {}

//     withEnums: WithEnums<IEnumTypeNamespace>

//     constructor(req: TypeReq<NamespaceT>) {
//         this.namespace = req.namespace
//         req.fields.forEach((f: IField) => {
//             this.fields[f.name] = f
//         })
//         this.withEnums = new WithEnums(req.withEnums)
//     }

//     getField(name: string): IField {
//         return this.fields[name]
//     }

//     // IWithEnums
//     getEnum(ns: IEnumTypeNamespace): IEnum<IEnumTypeNamespace> {
//         return this.withEnums.getEnum(ns)
//     }
// }

// /* * * * * *
//  * Type Field
//  * * * * * */

// export interface IField {
//     name: string
//     isRepeated?: boolean
//     isMetaField?: boolean
//     dtype: IFieldDtype
// }

// export interface IFieldDtype {
//     name: string
//     kind: FieldKind
//     namespace: IEntityNamespace | ITypeNamespace | IEnumNamespace
// }

// /* * * * * *
//  * Enum
//  * * * * * */

// interface IEnum<NamespaceT extends IEnumNamespace> {
//     namespace: NamespaceT
//     values: IEnumValue[]
// }

// interface EnumReq<NamespaceT extends IEnumNamespace> {
//     namespace: NamespaceT
//     values: IEnumValue[]
// }

// class Enum<NamespaceT extends IEnumNamespace> implements IEnum<NamespaceT> {
//     namespace: NamespaceT
//     values: IEnumValue[] = []

//     constructor(req: EnumReq<NamespaceT>) {
//         this.namespace = req.namespace
//         this.values = req.values
//     }
// }

// /* * * * * *
//  * Enum Values
//  * * * * * */

// interface IEnumValue {
//     value: string
//     id: number
//     getDisplayValue(): string
// }

// /* * * * * *
//  * Method
//  * * * * * */

// interface IMethod<NamespaceT extends IMethodNamespace, reqT = any, resT = any> {
//     namespace: NamespaceT
//     api: MethodAPI[]
//     makeAPIRequest(req: reqT): Promise<resT>
// }

// interface MethodReq<NamespaceT extends IMethodNamespace> {
//     namespace: NamespaceT
//     api: MethodAPI[]
// }

// class Method<NamespaceT extends IMethodNamespace, reqT = any, resT = any> implements IMethod<NamespaceT, reqT, resT> {
//     namespace: NamespaceT
//     api: MethodAPI[]

//     constructor(req: MethodReq<NamespaceT>) {
//         this.namespace = req.namespace
//         this.api = req.api
//     }

//     makeAPIRequest(req: reqT): Promise<resT> {
//         return Promise.resolve(req as unknown as resT)
//     }
// }

// /* * * * * *
//  * Method - API
//  * * * * * */

// interface MethodAPI {
//     method: 'GET' | 'POST' | 'PUT' | 'DELETE'
//     path: string
//     version: number
// }

// /* * * * * *
//  * With Services
//  * * * * * */

// interface IWithServices {
//     getService(namespace: IServiceNamespace): IService
// }

// interface WithServicesReq {
//     services: ServiceReq[]
// }

// class WithServices implements IWithServices {
//     services: Record<string, IService> = {}

//     constructor(req: WithServicesReq) {
//         req.services.forEach((elem) => {
//             this.services[elem.namespace.toString()] = new Service(elem)
//         })
//     }

//     getService(namespace: IServiceNamespace): IService {
//         return this.services[namespace.toString()]
//     }
// }

// /* * * * * *
//  * With Entity
//  * * * * * */

// interface IWithEntities {
//     getEntity(namespace: IEntityNamespace): IEntity
// }

// interface WithEntitiesReq {
//     entities: EntityReq[]
// }

// class WithEntities implements IWithEntities {
//     entities: Record<string, IEntity> = {}

//     constructor(req: WithEntitiesReq) {
//         req.entities.forEach((elem) => {
//             this.entities[elem.namespace.toString()] = new Entity(elem)
//         })
//     }

//     getEntity(namespace: IEntityNamespace): IEntity {
//         return this.entities[namespace.toString()]
//     }
// }

// /* * * * * *
//  * With Type
//  * * * * * */

// interface IWithTypes<NamespaceT extends ITypeNamespace> {
//     getType(namespace: NamespaceT): IType<NamespaceT>
// }

// interface WithTypesReq<NamespaceT extends ITypeNamespace> {
//     types: TypeReq<NamespaceT>[]
// }

// class WithTypes<NamespaceT extends ITypeNamespace> implements IWithTypes<NamespaceT> {
//     types: Record<string, IType<NamespaceT>> = {}

//     constructor(req: WithTypesReq<NamespaceT>) {
//         req.types.forEach((elem) => {
//             this.types[elem.namespace.toString()] = new Type(elem)
//         })
//     }

//     getType(namespace: NamespaceT): IType<NamespaceT> {
//         return this.types[namespace.toString()]
//     }
// }

// /* * * * * *
//  * With Enum
//  * * * * * */

// interface IWithEnums<NamespaceT extends IEnumNamespace> {
//     getEnum(ns: NamespaceT): IEnum<NamespaceT>
// }

// interface WithEnumsReq<NamespaceT extends IEnumNamespace> {
//     enums: EnumReq<NamespaceT>[]
// }

// class WithEnums<NamespaceT extends IEnumNamespace> implements IWithEnums<NamespaceT> {
//     enums: IEnum<NamespaceT>[] = []
//     enumsMap: Record<string, IEnum<NamespaceT>> = {}

//     constructor(req: WithEnumsReq<NamespaceT>) {
//         req.enums.forEach((elem) => {
//             this.enums.push(new Enum(elem))
//         })
//     }

//     getEnum(ns: NamespaceT): IEnum<NamespaceT> {
//         return this.enumsMap[ns.toString()]
//     }
// }

// /* * * * * *
//  * With Methods
//  * * * * * */

// interface IWithMethods<NamespaceT extends IMethodNamespace> {
//     getMethod(name: string): IMethod<NamespaceT>
// }

// interface WithMethodsReq<NamespaceT extends IMethodNamespace> {
//     methods: MethodReq<NamespaceT>[]
// }

// class WithMethods<NamespaceT extends IMethodNamespace> implements IWithMethods<NamespaceT> {
//     methods: Record<string, IMethod<NamespaceT>> = {}

//     constructor(req: WithMethodsReq<NamespaceT>) {
//         req.methods.forEach((elem) => {
//             this.methods[elem.namespace.toString()] = new Method(elem)
//         })
//     }

//     getMethod(name: string): IMethod<NamespaceT> {
//         return this.methods[name]
//     }
// }
