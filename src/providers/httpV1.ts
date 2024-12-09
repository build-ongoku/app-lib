import { EntityInfo, IEntityMinimal } from '../common/app_v3'
import { getSessionCookie } from '../common/AuthContext'
import * as scalars from '../common/scalars'
import { MetaFieldKeys, RequiredFields } from '../common/types'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import { addBaseURL, joinURL } from './provider'

// getBaseURL
export interface HTTPRequest<D> extends Omit<AxiosRequestConfig<D>, 'method' | 'url'> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
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
    fields?: string[]
    exclude_fields?: string[]
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

export const useGetEntity = <E extends IEntityMinimal = any>(props: EntityHttpRequest<E, GetEntityRequest>): readonly [HTTPResponse<E>, FetchFunc] => {
    const { entityInfo, data } = props

    console.log('[Provider] [Get Entity]', 'Fetching entity', 'entityName', entityInfo.getName().toRaw(), 'id', data?.id)

    // fetch data from a url endpoint
    const [resp, fetch] = useMakeRequest<E>({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath()),
        params: { req: data },
    })

    useEffect(() => {
        if (data?.id) {
            fetch({})
        }
    }, [])

    return [resp, fetch]
}

type FilterTypeFor<E extends IEntityMinimal> = any

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

export type FetchFunc<D = any> = (config: HTTPFetchRequest<D>) => void

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
        if (!loading) {
            setLoading(true)
        }
        if (finished) {
            setFinished(false)
        }
        if (data) {
            setData(undefined)
        }
        if (error) {
            setError(undefined)
        }
        if (statusCode) {
            setStatusCode(undefined)
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
