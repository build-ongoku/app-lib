import { getSessionCookie } from '@ongoku/app-lib/src/common/AuthContext'
import * as scalars from '@ongoku/app-lib/src/common/scalars'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'
import { Namespace } from '@ongoku/app-lib/src/common/namespacev2'
import { MetaFieldKeys, RequiredFields } from '@ongoku/app-lib/src/common/types'
import { EnumFieldFor, FilterTypeFor } from '@ongoku/app-lib/src/linker'

// getBaseURL returns the base URL for the backend API
// It does not add the version number.
// e.g. for DEV, it may return http://localhost:80/api/
const getBaseURL = (): string => {
    console.log('[Provider] [getBaseURL]', 'envVariables', process.env)
    let host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST
    let port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT
    if (!host) {
        console.error('[Provider] [getBaseURL] Host not set. Defaulting to localhost')
        host = 'localhost'
    }
    if (!port) {
        console.error('[Provider] [getBaseURL] Port not set. Defaulting to 80')
        port = '80'
    }
    return `http://${host}:${port}/api/`
}

// addBaseURL adds the base URL to the path
const addBaseURL = (path: string): string => {
    // remove any leading slash from the path
    if (path.startsWith('/')) {
        path = path.slice(1)
    }
    return getBaseURL() + path
}

// joinURL takes a list of strings and joins them with a slash
export const joinURL = (...parts: string[]): string => {
    // Remove any leading or trailing slashes from each part
    parts = parts.map((p) => p.replace(/^\/|\/$/g, ''))
    return parts.join('/')
}

export interface HTTPRequest<D> extends Omit<AxiosRequestConfig<D>, 'method' | 'url'> {
    method: 'GET' | 'POST' | 'PUT'
    path: string
    unauthenticated?: boolean
    // If set, it will be called in case we get an error
    errorCb?: (errMsg: string) => void
}

// Options used during fetch phase.
export interface HTTPFetchRequest<D = any> extends Pick<HTTPRequest<D>, 'data' | 'params'> {}

interface EntityHttpRequest<E extends IEntityMinimal, ReqT> extends Omit<HTTPRequest<ReqT>, 'method' | 'path'> {
    entityInfo: EntityInfo<E>
}

export interface AddEntityRequest<E extends IEntityMinimal> {
    object: Omit<E, MetaFieldKeys>
}

export const useAddEntity = <E extends IEntityMinimal = any>(props: EntityHttpRequest<E, AddEntityRequest<E>>): readonly [HTTPResponse<E>] => {
    const { entityInfo } = props

    console.log('Add Entity: ' + entityInfo.getName())

    const [resp, fetch] = useMakeRequest<E, AddEntityRequest<E>>({
        ...props,
        method: 'POST',
        path: joinURL('v1/', entityInfo.namespace.toURLPath()),
        data: props.data,
    })

    useEffect(() => {
        fetch({})
    }, [])

    return [resp]
}

export interface UpdateEntityRequest<E extends IEntityMinimal> {
    object: E
    fields?: EnumFieldFor<E>[]
    exclude_fields?: EnumFieldFor<E>[]
}

export const useUpdateEntity = <E extends IEntityMinimal>(props: EntityHttpRequest<E, UpdateEntityRequest<E>>): readonly [HTTPResponse<E>] => {
    const { entityInfo } = props

    console.log('Update Entity: ' + entityInfo.getName())

    // fetch data from a url endpoint
    if (!props.data?.object.id) {
        throw new Error('Object ID not set')
    }

    const [resp, fetch] = useMakeRequest<E, UpdateEntityRequest<E>>({
        method: 'PUT',
        path: joinURL('v1/', entityInfo.namespace.toURLPath(), props.data?.object.id),
        data: props.data,
    })

    useEffect(() => {
        fetch({})
    }, [props.data])

    return [resp]
}

export interface GetEntityRequest {
    id: scalars.ID
}

export const useGetEntity = <E extends IEntityMinimal = any>(props: EntityHttpRequest<E, GetEntityRequest>): readonly [HTTPResponse<E>] => {
    const { entityInfo, data } = props

    console.log('Get Entity: ' + entityInfo.getName())

    // fetch data from a url endpoint
    const [resp, fetch] = useMakeRequest<E>({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath()),
        params: { req: data },
    })

    useEffect(() => {
        fetch({})
    }, [])

    return [resp]
}

export interface ListEntityRequest<E extends IEntityMinimal> {
    req?: FilterTypeFor<E>
}

export interface ListEntityResponse<E extends IEntityMinimal> {
    items: E[]
    // Page: number
    // HasNextPage: boolean
}

export const useListEntity = <E extends IEntityMinimal>(props: EntityHttpRequest<E, ListEntityRequest<E>>): readonly [HTTPResponse<ListEntityResponse<E>>] => {
    const { entityInfo } = props

    console.log('(provider) (List Entity) ' + entityInfo.getName())

    // fetch data from a url endpoint
    const [resp, fetch] = useMakeRequest<ListEntityResponse<E>>({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath(), 'list'),
        params: props.params, // can include any filters here
    })

    useEffect(() => {
        console.log(`(provider) (List Entity) (${entityInfo.getName()}) Fetch`)
        fetch({})
    }, [])

    return [resp]
}

export interface ListByTextQueryRequest {
    query_text: string
}

export const useListEntityByTextQuery = <E extends IEntityMinimal = any>(
    props: EntityHttpRequest<E, ListByTextQueryRequest>
): readonly [HTTPResponse<ListEntityResponse<E>>, FetchFunc<ListByTextQueryRequest>] => {
    const { entityInfo } = props

    console.log('Query by Text Entity: ' + entityInfo.getName())

    // fetch data from a url endpoint
    return useMakeRequest({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath(), 'query_by_text'),
        params: props.params,
    })
}

// HTTPRequestCustomConfig are params that are open to the caller component to set, when they call our helpers like useGetEntity etc.

interface HTTPResponse<T = any> {
    statusCode?: number
    error?: string
    data?: T
    loading: boolean
    finished: boolean
}

export interface GokuHTTPResponse<T = any> {
    data?: T
    error?: string
    statusCode: number
}

interface MustGokuHTTPResponse<T = any> extends RequiredFields<GokuHTTPResponse<T>, 'data'> {}

type FetchFunc<D = any> = (config: HTTPFetchRequest<D>) => void

export const makeRequest = async <T = any, D = any>(props: HTTPRequest<D>): Promise<GokuHTTPResponse<T>> => {
    const { path, unauthenticated } = props

    // Overwrite the props with any new values in the config
    const config = { ...props }

    // Add auth token
    if (!unauthenticated) {
        const session = getSessionCookie()
        config.headers = config.headers ?? {}
        if (session?.token) {
            config.headers['Authorization'] = 'Bearer ' + session.token
        }
    }

    const url = addBaseURL(path)
    console.log('[HTTP] [useAxios]: Making an HTTP call', 'config', config, 'url', url)

    try {
        const result = await axios.request<GokuHTTPResponse<T>>({
            url: url,
            // paramsSerializer: We need to be able to pass objects a param values in the URL, so need to implement our own params serializer
            paramsSerializer: {
                serialize: (p) => {
                    const urlP = new URLSearchParams(p)
                    Object.entries(p).forEach(([k, v]) => {
                        urlP.set(k, JSON.stringify(v))
                    })
                    const r = decodeURI(urlP.toString())
                    return r
                },
            },
            ...config,
        })
        console.log('[HTTP] [useAxios] Request made', 'result', result)
        return { data: result.data?.data, statusCode: result.data?.statusCode, error: result.data?.error }
    } catch (err) {
        // Handle Error
        let errMsg: string = ''
        let statusCode: number = 500

        console.error(err)

        if (err instanceof AxiosError) {
            errMsg = err.response?.data?.error ?? err.message
            statusCode = err.status ?? err.response?.status ?? 500
        } else if (err instanceof Error) {
            errMsg = err.message
        } else {
            errMsg = String(err)
        }

        if (config.errorCb) {
            config.errorCb(errMsg)
        }

        return { error: errMsg, statusCode: statusCode }
    }
}

// T is the response type and D is the request data type
export const useMakeRequest = <T = any, D = any>(props: HTTPRequest<D>): readonly [HTTPResponse<T>, FetchFunc<D>] => {
    const [data, setData] = useState<T>() // response body
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [statusCode, setStatusCode] = useState<number>()
    const [finished, setFinished] = useState<boolean>(false)

    const fetch = async (fetchProps: HTTPFetchRequest<D>) => {
        // Whenever we fetch, we want to reset some values
        if (data) {
            setData(undefined)
        }
        if (error) {
            setError(undefined)
        }
        if (statusCode) {
            setStatusCode(undefined)
        }
        if (!loading) {
            setLoading(true)
        }
        if (finished) {
            setFinished(false)
        }

        // Overwrite the props with any new values in the config
        const finalConfig = { ...props, ...fetchProps }

        const resp = await makeRequest<T, D>(finalConfig)
        setData(resp.data)
        setError(resp.error)
        setStatusCode(resp.statusCode)
        setLoading(false)
        setFinished(true)
    }

    return [{ statusCode, data, error, loading, finished }, fetch] as const
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
    const fileEntityNamespace = new Namespace({ service: 'file', entity: 'file' })
    const fullUrl = addBaseURL(fileEntityNamespace.toURLPath() + '/upload')

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

/* * * * * *
 * Make Request V2
 * * * * * */

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// makeRequestV2 makes a vanilla fetch request
export const makeRequestV2 = async <RespT = any, ReqT = any>(props: { relativePath: string; method: HTTPMethod; data: ReqT; unauthenticated?: boolean }): Promise<GokuHTTPResponse<RespT>> => {
    console.debug('[Provider] [makeRequestV2]', 'props', props)
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

    // Create the request
    const req: RequestInit = {
        method: props.method,
        headers: headers,
    }

    // For GET, add the req as URL param
    if (props.method == 'GET') {
        // Add the data as query params
        const urlParams = new URLSearchParams()
        // Convert the data object to JSON and add it to the URL as 'req' param
        urlParams.append('req', JSON.stringify(props.data))

        fullUrl = fullUrl + '?' + urlParams.toString()
    } else if (props.method == 'POST' || props.method == 'PUT') {
        // For POST, PUT requests, set the request body
        req.body = JSON.stringify(props.data)
    } else {
        // Unsupported method
        throw new Error('Unsupported method: ' + props.method)
    }

    const response = await fetch(fullUrl, req)

    if (!response.ok) {
        return { error: 'Failed to upload file', statusCode: response.status }
    }

    const data = (await response.json()) as GokuHTTPResponse<RespT>

    return data
}
