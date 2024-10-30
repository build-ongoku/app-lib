import { RequiredFields } from './types';
export declare const acronyms: string[];
interface IName {
    equal(other: IName): boolean;
    append(suffix: string): Name;
    toRaw(): string;
    toCapital(): string;
    toSnake(): string;
    toPascal(): string;
    toCamel(): string;
    toFieldName(): string;
}
export declare class Name implements IName {
    raw: string;
    constructor(raw: string);
    equal(other: IName): boolean;
    append(suffix: string): Name;
    toRaw(): string;
    toCapital(): string;
    toSnake(): string;
    toPascal(): string;
    toCamel(): string;
    toFieldName(): string;
}
export interface INamespace<NsReqT extends NamespaceReq> {
    raw: NsReqT;
    service?: Name;
    entity?: Name;
    types?: Name[];
    enum?: Name;
    method?: Name;
    getTypeName(): Name;
    toRaw(): NsReqT;
    toString(): string;
    toLabel(): string;
    toURLPath(): string;
    equal(other: INamespace<NsReqT>): boolean;
}
export interface NamespaceReq {
    service?: string;
    entity?: string;
    types?: string[];
    enum?: string;
    method?: string;
}
export declare class Namespace<NsReqT extends NamespaceReq> implements INamespace<NsReqT> {
    raw: NsReqT;
    service?: Name;
    entity?: Name;
    types?: Name[];
    enum?: Name;
    method?: Name;
    constructor(req: NsReqT);
    toRaw(): NsReqT;
    getTypeName(): Name;
    toString(): string;
    toLabel(): string;
    toURLPath(): string;
    equal(other: INamespace<NsReqT>): boolean;
}
export interface IServiceNamespace extends INamespace<ServiceNamespaceReq> {
}
export interface IEntityNamespace extends INamespace<EntityNamespaceReq> {
}
export interface ITypeAppNamespace extends INamespace<TypeAppNamespaceReq> {
}
export interface ITypeServiceNamespace extends INamespace<TypeServiceNamespaceReq> {
}
export interface ITypeEntityNamespace extends INamespace<TypeEntityNamespaceReq> {
}
export type ITypeNamespace = ITypeAppNamespace | ITypeServiceNamespace | ITypeEntityNamespace;
export interface IEnumAppNamespace extends INamespace<EnumAppNamespaceReq> {
}
export interface IEnumServiceNamespace extends INamespace<EnumServiceNamespaceReq> {
}
export interface IEnumEntityNamespace extends INamespace<EnumEntityNamespaceReq> {
}
export interface IEnumTypeNamespace extends INamespace<EnumTypeNamespaceReq> {
}
export type IEnumNamespace = IEnumAppNamespace | IEnumServiceNamespace | IEnumEntityNamespace | IEnumTypeNamespace;
export interface IMethodServiceNamespace extends INamespace<MethodServiceNamespaceReq> {
}
export interface IMethodEntityNamespace extends INamespace<MethodEntityNamespaceReq> {
}
export type IMethodNamespace = IMethodServiceNamespace | IMethodEntityNamespace;
export interface ServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service'> {
}
export interface EntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity'> {
}
export interface TypeAppNamespaceReq extends RequiredFields<NamespaceReq, 'types'> {
}
export interface TypeServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'types'> {
}
export interface TypeEntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'types'> {
}
export type TypeNamespaceReq = TypeAppNamespaceReq | TypeServiceNamespaceReq | TypeEntityNamespaceReq;
export interface EnumAppNamespaceReq extends RequiredFields<NamespaceReq, 'enum'> {
}
export interface EnumServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'enum'> {
}
export interface EnumEntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'enum'> {
}
export interface EnumTypeNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'types' | 'enum'> {
}
export type EnumNamespaceReq = EnumAppNamespaceReq | EnumServiceNamespaceReq | EnumEntityNamespaceReq | EnumTypeNamespaceReq;
export interface MethodServiceNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'method'> {
}
export interface MethodEntityNamespaceReq extends RequiredFields<NamespaceReq, 'service' | 'entity' | 'method'> {
}
export type MethodNamespaceReq = MethodServiceNamespaceReq | MethodEntityNamespaceReq;
export {};
