import { IEntityMinimal, IEntityMinimalInput } from '../common/app_v3';
import { Optional } from '../common/types';
import * as scalars from '../common/scalars';
import { GokuHTTPResponse } from './provider';
import { NamespaceReq } from '../common/namespacev2';
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface MakeRequestProps<ReqT = any> {
    relativePath: string;
    method: HTTPMethod;
    data: ReqT;
    unauthenticated?: boolean;
}
interface MakeRequestResponse<RespT = any> extends GokuHTTPResponse<RespT> {
}
export declare const makeRequest: <RespT = any, ReqT = any>(props: MakeRequestProps<ReqT>) => Promise<MakeRequestResponse<RespT>>;
interface UseMakeRequestProps<ReqT = any> extends Optional<MakeRequestProps<ReqT>, 'data'> {
    skipFetchAtInit?: boolean;
}
interface UseMakeRequestResponse<ReqT = any, RespT = any> {
    resp: GokuHTTPResponse<RespT> | undefined;
    loading: boolean;
    error: string | undefined;
    fetchDone: boolean;
    fetch: FetchFunc<ReqT>;
}
export type FetchFunc<ReqT = any> = (data?: ReqT) => void;
export declare const useMakeRequest: <RespT = any, ReqT = any>(props: UseMakeRequestProps<ReqT>) => UseMakeRequestResponse<ReqT, RespT>;
interface XEntityMakeRequestProps<ReqT = any> extends Omit<MakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated'> {
}
interface UseXEntityMakeRequestProps<ReqT = any> extends Omit<UseMakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated'> {
}
interface XEntityProps<ReqT = any> extends XEntityMakeRequestProps<ReqT> {
    entityNamespace: NamespaceReq;
}
interface UseXEntityProps<ReqT = any> extends UseXEntityMakeRequestProps<ReqT> {
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
export declare const useAddEntity: <E extends IEntityMinimal>(props: UseXEntityProps<AddEntityRequestData<E>>) => UseMakeRequestResponse<AddEntityRequestData<E>, AddEntityResponseData>;
export interface GetEntityRequestData {
    id: scalars.ID;
}
export type GetEntityResponseData<E extends IEntityMinimal> = E;
export declare const getEntity: <E extends IEntityMinimal>(props: XEntityProps<GetEntityRequestData>) => Promise<MakeRequestResponse<GetEntityResponseData<E>>>;
export declare const useGetEntity: <E extends IEntityMinimal>(props: UseXEntityProps<GetEntityRequestData>) => UseMakeRequestResponse<GetEntityRequestData, GetEntityResponseData<E>>;
type FilterTypeFor<E extends IEntityMinimal> = any;
export interface ListEntityRequestData<E extends IEntityMinimal> {
    filter?: FilterTypeFor<E>;
}
export interface ListEntityResponseData<E extends IEntityMinimal> {
    items: E[];
}
export declare const listEntity: <E extends IEntityMinimal>(props: XEntityProps<ListEntityRequestData<E>>) => Promise<MakeRequestResponse<ListEntityResponseData<E>>>;
export declare const useListEntity: <E extends IEntityMinimal>(props: UseXEntityProps<ListEntityRequestData<E>>) => UseMakeRequestResponse<ListEntityRequestData<E>, ListEntityResponseData<E>>;
export interface QueryByTextEntityRequestData {
    queryText: string;
}
export interface QueryByTextEntityResponseData<E extends IEntityMinimal> extends ListEntityResponseData<E> {
}
export declare const queryByTextEntity: <E extends IEntityMinimal>(props: XEntityProps<QueryByTextEntityRequestData>) => Promise<MakeRequestResponse<QueryByTextEntityResponseData<E>>>;
export declare const useQueryByTextEntity: <E extends IEntityMinimal>(props: UseXEntityProps<QueryByTextEntityRequestData>) => UseMakeRequestResponse<QueryByTextEntityRequestData, QueryByTextEntityResponseData<E>>;
interface IDefaultFile {
    id: scalars.ID;
}
export declare const uploadFile: <FileT extends IDefaultFile = IDefaultFile>(file: File, onProgress: (progress: number) => void) => Promise<GokuHTTPResponse<FileT>>;
export {};
