import { GokuHTTPResponse, makeRequestV2 } from '@ongoku/app-lib/src/providers/provider'
import { Namespace, toURL } from './Namespace'

/* * * * * *
 * Method
 * * * * * */

interface IMethod<ReqT = any, ResT = any> {
    name: string
    namespace: Namespace
    api?: MethodAPI
    makeAPIRequest(req: ReqT): Promise<GokuHTTPResponse<ResT>>
}

interface MethodAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    version: number
}

export interface MethodReq<ReqT = any, ResT = any> {
    name: string
    namespace: Namespace
    api?: MethodAPI
}

export class Method<ReqT = any, ResT = any> implements IMethod<ReqT, ResT> {
    name: string
    namespace: Namespace
    api?: MethodAPI

    constructor(props: MethodReq<ReqT, ResT>) {
        this.name = props.name
        this.namespace = props.namespace
        this.api = props.api
    }

    makeAPIRequest(req: ReqT): Promise<GokuHTTPResponse<ResT>> {
        if (!this.api) {
            throw new Error('API for method is not defined')
        }

        const path = `v${this.api.version}/${toURL(this.namespace)}/${this.api.path}`

        return makeRequestV2({
            method: this.api.method,
            relativePath: path,
            data: req,
        })
    }
}

/* * * * * *
 * With Methods
 * * * * * */

export interface IWithMethods {
    getMethod<reqT, respT>(name: string): Method<reqT, respT>
}

export interface WithMethodsReq {
    methodReqs: MethodReq[]
}

export class WithMethods implements IWithMethods {
    methods: Record<string, Method<any, any>> = {}

    constructor(props: WithMethodsReq) {
        props.methodReqs?.forEach((methodReq: MethodReq<any, any>) => {
            this.methods[methodReq.name] = new Method(methodReq)
        })
    }

    getMethod<reqT, respT>(name: string): Method<reqT, respT> {
        return this.methods[name] as unknown as Method<reqT, respT>
    }
}
