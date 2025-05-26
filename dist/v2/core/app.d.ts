import { EntityNamespaceReq, EnumNamespaceReq, IEntityNamespace, IEnumNamespace, IMethodEntityNamespace, IMethodNamespace, IServiceNamespace, ITypeEntityNamespace, ITypeNamespace, MethodEntityNamespaceReq, MethodNamespaceReq, Name, ServiceNamespaceReq, TypeNamespaceReq } from "./namespace";
import { GokuHTTPResponse } from "../utils/api/util";
import { MetaFieldKeys } from "../utils/types";
import * as scalars from "./scalars";
export interface IApp {
    getName(): Name;
    getNameFriendly(): string;
    services: IService[];
    entityInfos: IEntityInfo<any>[];
    typeInfos: ITypeInfo<ITypeNamespace>[];
    enums: IEnum[];
    methods: IMethod<IMethodNamespace>[];
    getService(namespace: ServiceNamespaceReq): Service;
    getEntityInfo<E extends IEntityMinimal>(namespace: EntityNamespaceReq): EntityInfo<E> | undefined;
    getServiceEntities(namespace: ServiceNamespaceReq): EntityInfo<any>[];
    getTypeInfo<T extends ITypeMinimal>(namespace: TypeNamespaceReq): TypeInfo<T>;
    getEnum(namespace: EnumNamespaceReq): Enum;
    getMethod(name: MethodNamespaceReq): Method<IMethodNamespace>;
    getEntityMethods(namespace: IEntityNamespace): IMethod[];
}
export interface AppReq {
    name: Name;
    services: ServiceReq[];
    entityInfos: EntityInfoReq[];
    typeInfos: TypeInfoReq[];
    enums: EnumReq[];
    methods: MethodReq[];
}
export declare class App implements IApp {
    name: Name;
    services: Service[];
    entityInfos: EntityInfo<any>[];
    typeInfos: TypeInfo<any>[];
    enums: Enum[];
    methods: Method<IMethodNamespace>[];
    servicesMap: Record<string, Service>;
    entitiesMap: Record<string, EntityInfo<any>>;
    typesMap: Record<string, TypeInfo<any>>;
    enumsMap: Record<string, Enum>;
    methodsMap: Record<string, Method<IMethodNamespace>>;
    constructor(req: AppReq);
    getName(): Name;
    getNameFriendly(): string;
    getService(nsReq: ServiceNamespaceReq): Service;
    getEntityInfo<E extends IEntityMinimal>(nsReq: EntityNamespaceReq): EntityInfo<E> | undefined;
    getServiceEntities(nsReq: ServiceNamespaceReq): EntityInfo<any>[];
    getServiceMethods(nsReq: ServiceNamespaceReq): IMethod[];
    getTypeInfo<T extends ITypeMinimal>(nsReq: TypeNamespaceReq): TypeInfo<T>;
    getEnum(nsReq: EnumNamespaceReq): Enum;
    getMethod(nsReq: MethodNamespaceReq): Method;
    getEntityMethods(entNs: IEntityNamespace): IMethod[];
}
type Source = "mod" | "user";
interface IService {
    namespace: IServiceNamespace;
    description?: string;
    source?: Source;
    getName(): Name;
    getNameFriendly(): string;
}
export interface ServiceReq {
    namespace: ServiceNamespaceReq;
    description?: string;
    source?: Source;
}
export declare class Service implements IService {
    namespace: IServiceNamespace;
    description?: string;
    source?: Source;
    constructor(req: ServiceReq);
    getName(): Name;
    getNameFriendly(): string;
}
export interface ITypeMinimal {
}
interface ITypeInfo<T extends ITypeMinimal = any> {
    namespace: ITypeNamespace;
    fields: IField[];
    getField(name: string): IField;
    getTypeName(r: T): string;
    getEmptyObject(appInfo: App): Omit<T, MetaFieldKeys>;
}
export interface TypeInfoReq<T extends ITypeMinimal = any> {
    namespace: TypeNamespaceReq;
    fields: FieldReq[];
    getEmptyObjectFunc?: (appInfo: App) => Omit<T, MetaFieldKeys>;
}
export declare class TypeInfo<T extends ITypeMinimal = any> implements ITypeInfo<T> {
    namespace: ITypeNamespace;
    fields: Field[];
    fieldsMap: Record<string, Field>;
    constructor(req: TypeInfoReq<T>);
    getField(name: string): IField;
    getTypeName(r: any): string;
    getEmptyObject(appInfo: App): Omit<T, MetaFieldKeys>;
    getEmptyObjectFunc: (appInfo: App) => Omit<T, MetaFieldKeys>;
}
interface IField<T = any, ParentT = any> {
    name: Name;
    dtype: IDtype<T>;
    isRepeated?: boolean;
    isOptional?: boolean;
    isMetaField?: boolean;
    getLabel(): string;
    getFieldValue(obj: ParentT): T;
}
export interface FieldReq<T = any, ParentT = any> {
    name: Name;
    dtype: DtypeReq<T>;
    isRepeated?: boolean;
    isMetaField?: boolean;
    excludeFromForm?: boolean;
    isOptional?: boolean;
}
export declare class Field<T = any, ParentT = any> implements IField<T, ParentT> {
    name: Name;
    dtype: IDtype<T>;
    isRepeated?: boolean;
    isMetaField?: boolean;
    excludeFromForm?: boolean;
    isOptional?: boolean | undefined;
    constructor(req: FieldReq<T>);
    getLabel(): string;
    getLabelFunc: (field: Field<T, ParentT>) => string;
    getFieldValue(obj: ParentT): T;
}
interface IDtype<T = any> {
    name: Name;
    kind: IFieldKind;
    namespace?: IEntityNamespace | ITypeNamespace | IEnumNamespace;
    getEmptyValue(appInfo: App): T | undefined | null;
}
export interface DtypeReq<T = any> {
    name: Name;
    kind: IFieldKind;
    namespace?: EntityNamespaceReq | TypeNamespaceReq | EnumNamespaceReq;
}
export declare class Dtype<T = any> implements IDtype {
    name: Name;
    kind: IFieldKind;
    namespace?: IEntityNamespace | ITypeNamespace | IEnumNamespace;
    constructor(req: DtypeReq);
    getEmptyValue(appInfo: App): T | undefined | null;
}
export interface IEntityMinimal extends ITypeMinimal, IMetaFields {
}
export type IEntityMinimalInput<E extends IEntityMinimal> = Omit<E, MetaFieldKeys>;
interface IEntityInfo<E extends IEntityMinimal> {
    namespace: IEntityNamespace;
    actions: IEntityAction[];
    associations: IEntityAssociation[];
    getTypeNamespace(): ITypeEntityNamespace;
    getTypeInfo(appInfo: App): TypeInfo<E>;
    getName(): Name;
    getNameFriendly(): string;
    getEntityName(r: E): string;
    getEntityNameFriendly(r: E): string;
}
export interface EntityInfoReq<E extends IEntityMinimal = any> {
    namespace: EntityNamespaceReq;
    actions: EntityActionReq[];
    associations: EntityAssociationReq[];
}
export declare class EntityInfo<E extends IEntityMinimal> implements IEntityInfo<E> {
    namespace: IEntityNamespace;
    associations: IEntityAssociation[];
    actions: EntityAction[];
    constructor(req: EntityInfoReq);
    getTypeNamespace(): ITypeEntityNamespace;
    getTypeInfo(appInfo: App): TypeInfo<E>;
    getName(): Name;
    getNameFriendly(): string;
    funcGetNameFriendly: (info: EntityInfo<E>) => string;
    getEntityName(r: E): string;
    funcGetEntityName: (r: E, info: EntityInfo<E>) => string;
    getEntityNameFriendly(r: E): string;
    funcGetEntityNameFriendly: (r: E, info: EntityInfo<E>) => string;
}
interface IEntityAssociation {
    relationship: "child_of" | "parent_of";
    type: "one" | "many";
    entityNamespace: IEntityNamespace;
    name: Name;
    otherAssociationName?: Name;
    toFieldName(): Name;
}
export interface EntityAssociationReq {
    relationship: "child_of" | "parent_of";
    type: "one" | "many";
    entityNamespace: EntityNamespaceReq;
    name: Name;
    otherAssociationName?: Name;
}
export declare class EntityAssociation implements IEntityAssociation {
    relationship: "child_of" | "parent_of";
    type: "one" | "many";
    entityNamespace: IEntityNamespace;
    name: Name;
    otherAssociationName?: Name;
    constructor(req: EntityAssociationReq);
    toFieldName(): Name;
}
interface IEntityAction {
    name: Name;
    getLabel(): string;
    methodNamespace: IMethodEntityNamespace;
}
interface EntityActionReq {
    name: Name;
    methodNamespace: MethodEntityNamespaceReq;
}
declare class EntityAction implements IEntityAction {
    name: Name;
    methodNamespace: IMethodEntityNamespace;
    constructor(req: EntityActionReq);
    getLabel(): string;
}
interface IEnum {
    namespace: IEnumNamespace;
    values: IEnumValue[];
}
export interface EnumReq {
    namespace: EnumNamespaceReq;
    values: EnumValueReq[];
}
export declare class Enum implements IEnum {
    namespace: IEnumNamespace;
    values: IEnumValue[];
    constructor(req: EnumReq);
}
interface IEnumValue {
    id: number;
    value: string;
    description?: string;
    getDisplayValue(): string;
}
export interface EnumValueReq {
    id: number;
    value: string;
    description?: string;
    displayValue?: string;
}
export declare class EnumValue implements IEnumValue {
    id: number;
    value: string;
    description?: string;
    displayValue?: string;
    constructor(req: EnumValueReq);
    getDisplayValue(): string;
}
interface IMethod<ReqT = any, RespT = any> {
    namespace: IMethodNamespace;
    apis: MethodAPI[];
    requestDtype?: IDtype<ReqT>;
    responseDtype?: IDtype<RespT>;
    getAPI(): MethodAPI | undefined;
}
export interface MethodReq {
    namespace: MethodNamespaceReq;
    requestDtype?: DtypeReq;
    responseDtype: DtypeReq;
    apis: MethodAPIReq[];
}
export declare class Method<reqT = any, resT = any> implements IMethod<reqT> {
    namespace: IMethodNamespace;
    requestDtype?: Dtype<reqT>;
    responseDtype?: Dtype<reqT>;
    apis: MethodAPI[];
    constructor(req: MethodReq);
    getAPI(): MethodAPI | undefined;
}
interface MethodAPIReq {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    version: number;
    methodNamespace: MethodNamespaceReq;
}
declare class MethodAPI {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    relPath: string;
    version: number;
    methodNamespace: IMethodNamespace;
    constructor(req: MethodAPIReq);
    getEndpoint(): string;
    makeAPIRequest<ReqT = any, RespT = any>(req: ReqT): Promise<GokuHTTPResponse<RespT>>;
}
export interface IMetaFields {
    id: scalars.ID;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
export interface IMetaFieldWithParentID extends IMetaFields {
    parentID: scalars.ID;
}
export interface IFieldKind {
    readonly name: string;
}
export declare const StringKind: IFieldKind;
export declare const NumberKind: IFieldKind;
export declare const FloatKind: IFieldKind;
export declare const BoolKind: IFieldKind;
export declare const DateKind: IFieldKind;
export declare const TimestampKind: IFieldKind;
export declare const IDKind: IFieldKind;
export declare const EmailKind: IFieldKind;
export declare const LinkKind: IFieldKind;
export declare const SecretDecryptableKind: IFieldKind;
export declare const GenericDataKind: IFieldKind;
export declare const MoneyKind: IFieldKind;
export declare const EnumKind: IFieldKind;
export declare const NestedKind: IFieldKind;
export declare const ForeignEntityKind: IFieldKind;
export declare const FileKind: IFieldKind;
export declare const ConditionKind: IFieldKind;
export declare enum Operator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    IN = "IN",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
    LIKE = "LIKE",
    ILIKE = "ILIKE",
    NOT_LIKE = "NOT_LIKE",
    IS_NULL = "IS_NULL",
    IS_NOT_NULL = "IS_NOT_NULL"
}
export interface GenericCondition<T> {
    op: Operator;
    values: T[];
}
export interface StringCondition extends GenericCondition<string> {
}
export interface NumberCondition extends GenericCondition<number> {
}
export interface FloatCondition extends GenericCondition<number> {
}
export interface BoolCondition extends GenericCondition<boolean> {
}
export interface DateCondition extends GenericCondition<Date> {
}
export interface TimestampCondition extends GenericCondition<Date> {
}
export interface IDCondition extends GenericCondition<scalars.ID> {
}
export interface EmailCondition extends GenericCondition<scalars.Email> {
}
/**
 * Ongoku-specific configuration
 */
export interface OngokuConfig {
    apiEndpoint?: string;
    authToken?: string;
}
/**
 * Ongoku-specific App extension
 */
export declare class OngokuApp extends App {
    private _initialized;
    readonly apiEndpoint?: string;
    readonly authToken?: string;
    constructor(req: AppReq, config?: OngokuConfig);
    get isInitialized(): boolean;
    setInitialized(value: boolean): void;
    clone(): OngokuApp;
}
/**
 * Helper to create a default minimal AppReq
 */
export declare const createDefaultAppReq: (name?: string) => AppReq;
export {};
