import { EntityInfo, IEntityMinimal } from '../common/app_v3';
import * as scalars from '../common/scalars';
import { MetaFieldKeys } from '../common/types';
import { AxiosRequestConfig } from 'axios';
export interface HTTPRequest<D> extends Omit<AxiosRequestConfig<D>, 'method' | 'url'> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
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
type FilterTypeFor<E extends IEntityMinimal> = any;
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
export {};
