import { IEntityMinimal, IEntityMinimalInput } from '../../core/app';
import * as scalars from '../../core/scalars';
import { GokuHTTPResponse } from './util';
import { NamespaceReq } from '../../core/namespace';
import { HTTPMethod } from '../http';
export interface MakeRequestProps<ReqT = any> {
    relativePath: string;
    method: HTTPMethod;
    data: ReqT;
    authToken?: string;
}
export interface MakeRequestResponse<RespT = any> extends GokuHTTPResponse<RespT> {
}
export declare const makeRequest: <RespT = any, ReqT = any>(props: MakeRequestProps<ReqT>) => Promise<MakeRequestResponse<RespT>>;
export interface XEntityMakeRequestProps<ReqT = any> extends Omit<MakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated' | 'url'> {
}
export interface XEntityProps<ReqT = any> extends XEntityMakeRequestProps<ReqT> {
    entityNamespace: NamespaceReq;
}
export declare const getAddEntityMethodAndPath: (nsReq: NamespaceReq) => {
    method: HTTPMethod;
    relPath: string;
};
export interface AddEntityRequestData<E extends IEntityMinimal> {
    object: IEntityMinimalInput<E>;
}
export interface AddEntityResponseData extends IEntityMinimal {
}
export declare const addEntity: <E extends IEntityMinimal>(props: XEntityProps<AddEntityRequestData<E>>) => Promise<MakeRequestResponse<AddEntityResponseData>>;
export declare const getUpdateEntityMethodAndPath: (nsReq: NamespaceReq) => {
    method: HTTPMethod;
    relPath: string;
};
export interface UpdateEntityRequestData<E extends IEntityMinimal> {
    object: E;
}
export interface UpdateEntityResponseData<E extends IEntityMinimal> {
    object: E;
}
export declare const getGetEntityMethodAndPath: (nsReq: NamespaceReq) => {
    method: HTTPMethod;
    relPath: string;
};
export interface GetEntityRequestData {
    id: scalars.ID;
}
export type GetEntityResponseData<E extends IEntityMinimal> = E;
export declare const getEntity: <E extends IEntityMinimal>(props: XEntityProps<GetEntityRequestData>) => Promise<MakeRequestResponse<GetEntityResponseData<E>>>;
export declare const getListEntityMethodAndPath: (nsReq: NamespaceReq) => {
    method: HTTPMethod;
    relPath: string;
};
type FilterTypeFor<E extends IEntityMinimal> = any;
export interface ListEntityRequestData<E extends IEntityMinimal> {
    filter?: FilterTypeFor<E>;
}
export interface ListEntityResponseData<E extends IEntityMinimal> {
    items: E[];
}
export declare const listEntity: <E extends IEntityMinimal>(props: XEntityProps<ListEntityRequestData<E>>) => Promise<MakeRequestResponse<ListEntityResponseData<E>>>;
export interface QueryByTextEntityRequestData {
    queryText: string;
}
export interface QueryByTextEntityResponseData<E extends IEntityMinimal> extends ListEntityResponseData<E> {
}
export declare const queryByTextEntity: <E extends IEntityMinimal>(props: XEntityProps<QueryByTextEntityRequestData>) => Promise<MakeRequestResponse<QueryByTextEntityResponseData<E>>>;
interface IDefaultFile {
    id: scalars.ID;
}
export declare const uploadFile: <FileT extends IDefaultFile = IDefaultFile>(file: File, onProgress: (progress: number) => void) => Promise<GokuHTTPResponse<FileT>>;
export {};
