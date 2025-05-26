import { IEntityMinimal } from '../../core/app';
import { Optional } from '../types';
import { GokuHTTPResponse } from './util';
import { NamespaceReq } from '../../core/namespace';
import { AddEntityRequestData, AddEntityResponseData, GetEntityRequestData, GetEntityResponseData, ListEntityRequestData, ListEntityResponseData, MakeRequestProps, QueryByTextEntityRequestData, QueryByTextEntityResponseData } from './common';
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
interface UseXEntityMakeRequestProps<ReqT = any> extends Omit<UseMakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated' | 'url'> {
}
interface UseXEntityProps<ReqT = any> extends UseXEntityMakeRequestProps<ReqT> {
    entityNamespace: NamespaceReq;
}
export declare const useAddEntity: <E extends IEntityMinimal>(props: UseXEntityProps<AddEntityRequestData<E>>) => UseMakeRequestResponse<AddEntityRequestData<E>, AddEntityResponseData>;
export declare const useGetEntity: <E extends IEntityMinimal>(props: UseXEntityProps<GetEntityRequestData>) => UseMakeRequestResponse<GetEntityRequestData, GetEntityResponseData<E>>;
export declare const useListEntity: <E extends IEntityMinimal>(props: UseXEntityProps<ListEntityRequestData<E>>) => UseMakeRequestResponse<ListEntityRequestData<E>, ListEntityResponseData<E>>;
export declare const useQueryByTextEntity: <E extends IEntityMinimal>(props: UseXEntityProps<QueryByTextEntityRequestData>) => UseMakeRequestResponse<QueryByTextEntityRequestData, QueryByTextEntityResponseData<E>>;
export {};
