import { EntityInfo, IEntityMinimal } from '../common/app_v3';
import * as scalars from '../common/scalars';
import { MetaFieldKeys } from '../common/types';
import { AxiosRequestConfig } from 'axios';
export declare const joinURL: (...parts: string[]) => string;
export interface HTTPRequest<D> extends Omit<AxiosRequestConfig<D>, 'method' | 'url'> {
    method: 'GET' | 'POST' | 'PUT';
    path: string;
    unauthenticated?: boolean;
    errorCb?: (errMsg: string) => void;
}
export interface HTTPFetchRequest<D = any> extends Pick<HTTPRequest<D>, 'data' | 'params'> {
}
interface EntityHttpRequest<E extends IEntityMinimal, ReqT> extends Omit<HTTPRequest<ReqT>, 'method' | 'path'> {
    entityInfo: EntityInfo<E>;
}
export interface AddEntityRequest<E extends IEntityMinimal> {
    object: Omit<E, MetaFieldKeys>;
}
export declare const useAddEntity: <E extends IEntityMinimal = any>(props: EntityHttpRequest<E, AddEntityRequest<E>>) => readonly [HTTPResponse<E>];
export interface UpdateEntityRequest<E extends IEntityMinimal> {
    object: E;
    fields?: string[];
    exclude_fields?: string[];
}
export declare const useUpdateEntity: <E extends IEntityMinimal>(props: EntityHttpRequest<E, UpdateEntityRequest<E>>) => readonly [HTTPResponse<E>];
export interface GetEntityRequest {
    id: scalars.ID;
}
export declare const useGetEntity: <E extends IEntityMinimal = any>(props: EntityHttpRequest<E, GetEntityRequest>) => readonly [HTTPResponse<E>, FetchFunc];
export interface ListEntityRequest<E extends IEntityMinimal> {
    req?: FilterTypeFor<E>;
}
export interface ListEntityResponse<E extends IEntityMinimal> {
    items: E[];
}
export declare const useListEntity: <E extends IEntityMinimal>(props: EntityHttpRequest<E, ListEntityRequest<E>>) => readonly [HTTPResponse<ListEntityResponse<E>>];
export interface ListByTextQueryRequest {
    query_text: string;
}
export declare const useListEntityByTextQuery: <E extends IEntityMinimal = any>(props: EntityHttpRequest<E, ListByTextQueryRequest>) => readonly [HTTPResponse<ListEntityResponse<E>>, FetchFunc<ListByTextQueryRequest>];
interface HTTPResponse<T = any> {
    statusCode?: number;
    error?: string;
    data?: T;
    loading: boolean;
    finished: boolean;
}
export interface GokuHTTPResponse<T = any> {
    data?: T;
    error?: string;
    statusCode: number;
}
export type FetchFunc<D = any> = (config: HTTPFetchRequest<D>) => void;
export declare const makeRequest: <T = any, D = any>(props: HTTPRequest<D>) => Promise<GokuHTTPResponse<T>>;
export declare const useMakeRequest: <T = any, D = any>(props: HTTPRequest<D>) => readonly [HTTPResponse<T>, FetchFunc<D>];
interface IDefaultFile {
    id: scalars.ID;
}
export declare const uploadFile: <FileT extends IDefaultFile = IDefaultFile>(file: File, onProgress: (progress: number) => void) => Promise<GokuHTTPResponse<FileT>>;
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export declare const makeRequestV2: <RespT = any, ReqT = any>(props: {
    relativePath: string;
    method: HTTPMethod;
    data: ReqT;
    unauthenticated?: boolean;
}) => Promise<GokuHTTPResponse<RespT>>;
type FilterTypeFor<E extends IEntityMinimal> = any;
export interface DefaultRequestEntityList<E extends IEntityMinimal> {
    filter?: FilterTypeFor<E>;
}
export interface DefaultResponseEntityList<E extends IEntityMinimal> {
    items: E[];
}
export declare const listEntityV2: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: DefaultRequestEntityList<E>;
}) => Promise<GokuHTTPResponse<DefaultResponseEntityList<E>>>;
export declare const useListEntityV2: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: DefaultRequestEntityList<E>;
}) => [GokuHTTPResponse<DefaultResponseEntityList<E>> | undefined, boolean];
export interface QueryByTextDefaultRequest {
    queryText: string;
}
export interface QueryByTextDefaultResponse<E extends IEntityMinimal> extends DefaultResponseEntityList<E> {
}
export declare const queryByTextV2: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: QueryByTextDefaultRequest;
}) => Promise<GokuHTTPResponse<QueryByTextDefaultResponse<E>>>;
type RefetchFunc = () => void;
export declare const useQueryByTextV2: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: QueryByTextDefaultRequest;
}) => [GokuHTTPResponse<QueryByTextDefaultResponse<E>> | undefined, boolean, RefetchFunc];
export {};
