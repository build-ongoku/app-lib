import { IEntityMinimal, IEntityMinimalInput } from '../common/app_v3'
import { getSessionCookie } from '../common/AuthContext'
import { Optional } from '../common/types'
import { useEffect, useState } from 'react'
import * as scalars from '../common/scalars'
import { addBaseURL, GokuHTTPResponse, joinURL } from './provider'
import { Namespace, NamespaceReq } from '../common/namespacev2'

/* * * * * *
 * Make Request V2
 * * * * * */

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface MakeRequestProps<ReqT = any> {
    relativePath: string
    method: HTTPMethod
    data: ReqT
    unauthenticated?: boolean
}

interface MakeRequestResponse<RespT = any> extends GokuHTTPResponse<RespT> {}

// makeRequest makes a vanilla fetch request
export const makeRequest = async <RespT = any, ReqT = any>(props: MakeRequestProps<ReqT>): Promise<MakeRequestResponse<RespT>> => {
    console.debug('[Provider] [makeRequest]', 'props', props)
    // Get the full path
    let fullUrl = addBaseURL(props.relativePath)

    const headers = new Headers()

    // Add authentciation token header if needed
    if (!props.unauthenticated) {
        const session = getSessionCookie()
        if (session?.token) {
            headers.append('Authorization', 'Bearer ' + session.token)
        }
    }

    // Create the request (an inbuilt node type)
    const req: RequestInit = {
        method: props.method,
        headers: headers,
    }

    // Set the request data load (body or URL params)
    if (props.method == 'GET' || props.method == 'DELETE') {
        // For GET & DELETE, add the req as URL param
        const urlParams = new URLSearchParams()
        // Convert the data object to JSON and add it to the URL as 'req' param
        urlParams.append('req', JSON.stringify(props.data))
        fullUrl = fullUrl + '?' + urlParams.toString()
    } else if (props.method == 'POST' || props.method == 'PUT') {
        // For POST, PUT requests, set the request body
        req.body = JSON.stringify(props.data)
    } else {
        // Unsupported method
        throw new Error('Ongoku Applib does not support the HTTP method: ' + props.method)
    }

    let httpResp: Response
    try {
        httpResp = await fetch(fullUrl, req)
    } catch (err) {
        const errMsg = 'Are you sure the backend is running? Admin Tool could not communicate with the backend. Please see the logs for more information.'
        console.error(errMsg)
        return { error: errMsg, statusCode: 0 } // We don't know the status code because the request itself failed
    }

    // Bad status
    if (!httpResp.ok) {
        // If we get a non-200 status code, we should still expect a valid response type with the error message
        try {
            const data = (await httpResp.json()) as GokuHTTPResponse<RespT>
            return data
        } catch {
            return { error: 'Got a non-OK HTTP response', statusCode: httpResp.status }
        }
    }

    // Good status
    try {
        const data = (await httpResp.json()) as GokuHTTPResponse<RespT>
        return data
    } catch (err) {
        const errMsg = 'Could not parse HTTP response to JSON: ' + err
        console.error(errMsg)
        return { error: errMsg, statusCode: httpResp.status }
    }
}

// Made 'data' optional so it can be passed in the fetch function later
interface UseMakeRequestProps<ReqT = any> extends Optional<MakeRequestProps<ReqT>, 'data'> {
    skipFetchAtInit?: boolean
}

interface UseMakeRequestResponse<ReqT = any, RespT = any> {
    resp: GokuHTTPResponse<RespT> | undefined
    loading: boolean
    error: string | undefined
    fetchDone: boolean
    fetch: FetchFunc<ReqT> // fetch, if new data is not provided, uses the data from the props
}

export type FetchFunc<ReqT = any> = (data?: ReqT) => void

// useMakeRequest is a hook that makes a request and returns the response.
export const useMakeRequest = <RespT = any, ReqT = any>(props: UseMakeRequestProps<ReqT>): UseMakeRequestResponse<ReqT, RespT> => {
    // Define states
    const [resp, setResp] = useState<GokuHTTPResponse<RespT>>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>()
    const [fetchDone, setFetchDone] = useState<boolean>(false)

    // Define a fetch function
    const fetch = (data?: ReqT) => {
        console.log('[Provider] [useMakeRequest] Fetching', 'props', props)
        if (!loading) {
            setLoading(true)
        }
        // Ensure we have data
        const finalData = data ?? props.data
        if (!finalData) {
            console.log('[Provider] [useMakeRequest] Data not set')
            throw new Error('Data not set')
        }
        // Create a copy of the props
        const finalProps: MakeRequestProps<ReqT> = { ...props, data: finalData }

        makeRequest(finalProps)
            .then((r) => {
                setResp(r)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
                if (!fetchDone) {
                    setFetchDone(true)
                }
                setFetchDone(true)
            })
    }

    // Optionally, fetch at init
    useEffect(() => {
        if (props.skipFetchAtInit) {
            return
        }
        console.log('[Provider] [useMakeRequest] useEffect(): fetch', 'props.data', props.data)
        fetch(props.data)
    }, [])

    const ret: UseMakeRequestResponse<ReqT, RespT> = { resp: resp, loading: loading, error: error, fetchDone: fetchDone, fetch: fetch }
    return ret
}

/* * * * * *
 * Entity
 * * * * * */

// XEntityMakeRequestProps are the standard props needed for all XEntity requests.
interface XEntityMakeRequestProps<ReqT = any> extends Omit<MakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated'> {}

interface UseXEntityMakeRequestProps<ReqT = any> extends Omit<UseMakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated'> {}

interface XEntityProps<ReqT = any> extends XEntityMakeRequestProps<ReqT> {
    entityNamespace: NamespaceReq
}

interface UseXEntityProps<ReqT = any> extends UseXEntityMakeRequestProps<ReqT> {
    entityNamespace: NamespaceReq
}

/* * * * * *
 * Add Entity
 * * * * * */

// Get the method and the relative path for adding an entity
export const getAddEntityMethodAndPath = (nsReq: NamespaceReq): { method: HTTPMethod; relPath: string } => {
    // Validate props
    const ns = new Namespace(nsReq)
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not')
    }
    return {
        method: 'POST',
        relPath: joinURL('v1/', ns.toURLPath()),
    }
}

export interface AddEntityRequestData<E extends IEntityMinimal> {
    object: IEntityMinimalInput<E>
}
export interface AddEntityResponseData extends IEntityMinimal {}

export const addEntity = <E extends IEntityMinimal>(props: XEntityProps<AddEntityRequestData<E>>): Promise<MakeRequestResponse<AddEntityResponseData>> => {
    // Get the method path to make the request
    const { method, relPath } = getAddEntityMethodAndPath(props.entityNamespace)

    // Make the request
    return makeRequest<AddEntityResponseData, AddEntityRequestData<E>>({
        relativePath: relPath,
        method: method,
        data: props.data,
    })
}

export const useAddEntity = <E extends IEntityMinimal>(props: UseXEntityProps<AddEntityRequestData<E>>): UseMakeRequestResponse<AddEntityRequestData<E>, AddEntityResponseData> => {
    // Get the method path to make the request
    const { method, relPath } = getAddEntityMethodAndPath(props.entityNamespace)

    return useMakeRequest<AddEntityResponseData, AddEntityRequestData<E>>({
        ...props,
        method: method,
        relativePath: relPath,
    })
}

/* * * * * *
 * Update Entity
 * * * * * */

// Get the method and the relative path for adding an entity
export const getUpdateEntityMethodAndPath = (nsReq: NamespaceReq): { method: HTTPMethod; relPath: string } => {
    // Validate props
    const ns = new Namespace(nsReq)
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not')
    }
    return {
        method: 'PUT',
        relPath: joinURL('v1/', ns.toURLPath()),
    }
}

export interface UpdateEntityRequestData<E extends IEntityMinimal> {
    object: E
}

export interface UpdateEntityResponseData<E extends IEntityMinimal> {
    object: E
}

/* * * * * *
 * Get Entity
 * * * * * */

const getGetEntityMethodAndPath = (nsReq: NamespaceReq): { method: HTTPMethod; relPath: string } => {
    // Validate props
    const ns = new Namespace(nsReq)
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not')
    }
    return {
        method: 'GET',
        relPath: joinURL('v1/', ns.toURLPath()),
    }
}

export interface GetEntityRequestData {
    id: scalars.ID
}

export type GetEntityResponseData<E extends IEntityMinimal> = E

export const getEntity = <E extends IEntityMinimal>(props: XEntityProps<GetEntityRequestData>): Promise<MakeRequestResponse<GetEntityResponseData<E>>> => {
    // Get the method path to make the request
    const { method, relPath } = getGetEntityMethodAndPath(props.entityNamespace)

    // Make the request
    return makeRequest<GetEntityResponseData<E>, GetEntityRequestData>({
        method: method,
        relativePath: relPath,
        data: props.data,
    })
}

export const useGetEntity = <E extends IEntityMinimal>(props: UseXEntityProps<GetEntityRequestData>): UseMakeRequestResponse<GetEntityRequestData, GetEntityResponseData<E>> => {
    // Get the method path to make the request
    const { method, relPath } = getGetEntityMethodAndPath(props.entityNamespace)

    return useMakeRequest<GetEntityResponseData<E>, GetEntityRequestData>({
        ...props,
        method: method,
        relativePath: relPath,
    })
}

/* * * * * *
 * List Entity
 * * * * * */

const getListEntityMethodAndPath = (nsReq: NamespaceReq): { method: HTTPMethod; relPath: string } => {
    // Validate props
    const ns = new Namespace(nsReq)
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not')
    }
    return {
        method: 'GET',
        relPath: joinURL('v1/', ns.toURLPath(), 'list'),
    }
}

type FilterTypeFor<E extends IEntityMinimal> = any

export interface ListEntityRequestData<E extends IEntityMinimal> {
    filter?: FilterTypeFor<E>
}

export interface ListEntityResponseData<E extends IEntityMinimal> {
    items: E[]
}

export const listEntity = <E extends IEntityMinimal>(props: XEntityProps<ListEntityRequestData<E>>): Promise<MakeRequestResponse<ListEntityResponseData<E>>> => {
    // Get the method path to make the request
    const { method, relPath } = getListEntityMethodAndPath(props.entityNamespace)

    return makeRequest<ListEntityResponseData<E>, ListEntityRequestData<E>>({
        method: method,
        relativePath: relPath,
        data: props.data,
    })
}

export const useListEntity = <E extends IEntityMinimal>(props: UseXEntityProps<ListEntityRequestData<E>>): UseMakeRequestResponse<ListEntityRequestData<E>, ListEntityResponseData<E>> => {
    // Get the method path to make the request
    const { method, relPath } = getListEntityMethodAndPath(props.entityNamespace)

    return useMakeRequest<ListEntityResponseData<E>, ListEntityRequestData<E>>({
        ...props,
        method: method,
        relativePath: relPath,
    })
}

/* * * * * *
 * Query by Text V2
 * * * * * */

const getQueryByTextEntityMethodAndPath = (nsReq: NamespaceReq): { method: HTTPMethod; relPath: string } => {
    // Validate props
    const ns = new Namespace(nsReq)
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not')
    }
    return {
        method: 'GET',
        relPath: joinURL('v1/', ns.toURLPath(), 'query_by_text'),
    }
}

export interface QueryByTextEntityRequestData {
    queryText: string
}

export interface QueryByTextEntityResponseData<E extends IEntityMinimal> extends ListEntityResponseData<E> {}

export const queryByTextEntity = <E extends IEntityMinimal>(props: XEntityProps<QueryByTextEntityRequestData>): Promise<MakeRequestResponse<QueryByTextEntityResponseData<E>>> => {
    // Get the method path to make the request
    const { method, relPath } = getQueryByTextEntityMethodAndPath(props.entityNamespace)

    // Make the request
    return makeRequest<QueryByTextEntityResponseData<E>, QueryByTextEntityRequestData>({
        method: method,
        relativePath: relPath,
        data: props.data,
    })
}

export const useQueryByTextEntity = <E extends IEntityMinimal>(
    props: UseXEntityProps<QueryByTextEntityRequestData>
): UseMakeRequestResponse<QueryByTextEntityRequestData, QueryByTextEntityResponseData<E>> => {
    // Get the method path to make the request
    const { method, relPath } = getListEntityMethodAndPath(props.entityNamespace)

    return useMakeRequest<QueryByTextEntityResponseData<E>, QueryByTextEntityRequestData>({
        ...props,
        method: method,
        relativePath: relPath,
    })
}

/* * * * * *
 * File Upload
 * * * * * */

interface IDefaultFile {
    id: scalars.ID
}

export const uploadFile = async <FileT extends IDefaultFile = IDefaultFile>(file: File, onProgress: (progress: number) => void): Promise<GokuHTTPResponse<FileT>> => {
    // Make a post request to the file entity upload endpoint
    // Get the File entity
    const fileEntityNamespace = new Namespace({ service: 'core' })
    const relPath = joinURL('v1/', fileEntityNamespace.toURLPath(), 'file/upload')
    const fullUrl = addBaseURL(relPath)

    const session = getSessionCookie()
    const headers = new Headers()
    if (session?.token) {
        headers.append('Authorization', 'Bearer ' + session.token)
    }

    // Don't set Content-Type, let the browser set it automatically
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: headers, // No 'Content-Type' header here
        body: formData,
    })

    if (!response.ok) {
        return { error: 'Failed to upload file', statusCode: response.status }
    }

    const data = (await response.json()) as GokuHTTPResponse<FileT>
    return data
}
