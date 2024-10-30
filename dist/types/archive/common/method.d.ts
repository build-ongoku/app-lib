import { GokuHTTPResponse } from '@ongoku/app-lib/src/providers/provider';
import { Namespace } from './Namespace';
interface IMethod<ReqT = any, ResT = any> {
    name: string;
    namespace: Namespace;
    api?: MethodAPI;
    makeAPIRequest(req: ReqT): Promise<GokuHTTPResponse<ResT>>;
}
interface MethodAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    version: number;
}
export interface MethodReq<ReqT = any, ResT = any> {
    name: string;
    namespace: Namespace;
    api?: MethodAPI;
}
export declare class Method<ReqT = any, ResT = any> implements IMethod<ReqT, ResT> {
    name: string;
    namespace: Namespace;
    api?: MethodAPI;
    constructor(props: MethodReq<ReqT, ResT>);
    makeAPIRequest(req: ReqT): Promise<GokuHTTPResponse<ResT>>;
}
export interface IWithMethods {
    getMethod<reqT, respT>(name: string): Method<reqT, respT>;
}
export interface WithMethodsReq {
    methodReqs: MethodReq[];
}
export declare class WithMethods implements IWithMethods {
    methods: Record<string, Method<any, any>>;
    constructor(props: WithMethodsReq);
    getMethod<reqT, respT>(name: string): Method<reqT, respT>;
}
export {};
