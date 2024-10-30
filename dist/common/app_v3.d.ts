import { MetaFields } from '@ongoku/app-lib/src/common/Field';
import { IFieldKind } from '@ongoku/app-lib/src/common/fieldkind';
import { EntityNamespaceReq, EnumNamespaceReq, IEntityNamespace, IEnumNamespace, IMethodEntityNamespace, IMethodNamespace, IServiceNamespace, ITypeEntityNamespace, ITypeNamespace, MethodEntityNamespaceReq, MethodNamespaceReq, Name, ServiceNamespaceReq, TypeNamespaceReq } from '@ongoku/app-lib/src/common/namespacev2';
import { MetaFieldKeys } from '@ongoku/app-lib/src/common/types';
import { GokuHTTPResponse } from '@ongoku/app-lib/src/providers/provider';
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
    getTypeInfo<T extends ITypeMinimal>(nsReq: TypeNamespaceReq): TypeInfo<T>;
    getEnum(nsReq: EnumNamespaceReq): Enum;
    getMethod(nsReq: MethodNamespaceReq): Method<IMethodNamespace>;
    getEntityMethods(entNs: IEntityNamespace): IMethod[];
}
interface IService {
    namespace: IServiceNamespace;
    getName(): Name;
    getNameFriendly(): string;
}
export interface ServiceReq {
    namespace: ServiceNamespaceReq;
}
export declare class Service implements IService {
    namespace: IServiceNamespace;
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
}
export interface DtypeReq<T = any> {
    name: Name;
    kind: IFieldKind;
    namespace?: EntityNamespaceReq | TypeNamespaceReq | EnumNamespaceReq;
}
export interface IEntityMinimal extends ITypeMinimal, MetaFields {
}
interface IEntityInfo<E extends IEntityMinimal> {
    namespace: IEntityNamespace;
    actions: IEntityAction[];
    associations: IEntityAssociation[];
    getTypeNamespace(): ITypeEntityNamespace;
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
    getName(): Name;
    getNameFriendly(): string;
    funcGetNameFriendly: (info: EntityInfo<E>) => string;
    getEntityName(r: E): string;
    funcGetEntityName: (r: E, info: EntityInfo<E>) => string;
    getEntityNameFriendly(r: E): string;
    funcGetEntityNameFriendly: (r: E, info: EntityInfo<E>) => string;
}
interface IEntityAssociation {
    relationship: 'child_of' | 'parent_of';
    type: 'one' | 'many';
    entityNamespace: IEntityNamespace;
    name: Name;
    otherAssociationName?: Name;
    toFieldName(): Name;
}
export interface EntityAssociationReq {
    relationship: 'child_of' | 'parent_of';
    type: 'one' | 'many';
    entityNamespace: EntityNamespaceReq;
    name: Name;
    otherAssociationName?: Name;
}
export declare class EntityAssociation implements IEntityAssociation {
    relationship: 'child_of' | 'parent_of';
    type: 'one' | 'many';
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
interface IMethod<reqT = any, resT = any> {
    namespace: IMethodNamespace;
    apis: IMethodAPI[];
    requestTypeNamespace?: ITypeNamespace;
    responseTypeNamespace: ITypeNamespace;
    getAPIEndpoint(): string;
    makeAPIRequest(req: reqT): Promise<GokuHTTPResponse<resT>>;
}
export interface MethodReq {
    namespace: MethodNamespaceReq;
    requestTypeNamespace?: TypeNamespaceReq;
    responseTypeNamespace: TypeNamespaceReq;
    apis: IMethodAPI[];
}
export declare class Method<reqT = any, resT = any> implements IMethod<reqT, resT> {
    namespace: IMethodNamespace;
    requestTypeNamespace?: ITypeNamespace;
    responseTypeNamespace: ITypeNamespace;
    apis: IMethodAPI[];
    constructor(req: MethodReq);
    getAPIEndpoint(): string;
    makeAPIRequest<ReqT = any, RespT = any>(req: ReqT): Promise<GokuHTTPResponse<RespT>>;
}
interface IMethodAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    version: number;
}
export {};
