import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { UUID } from '@ongoku/app-lib/src/common/Primitives'
import { useEffect, useState } from 'react'
import { getSessionCookie } from '../common/AuthContext'
import { EnumFieldFor, FilterTypeFor } from '@/linker'

const getBaseURL = (): string => {
    console.log(process.env)
    let host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST
    let port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT
    if (!host) {
        console.error('Host not set. Defaulting to localhost')
        host = 'localhost'
    }
    if (!port) {
        console.error('Port not set. Defaulting to 80')
        port = '80'
    }
    return `http://${host}:${port}/api/`
}

const getUrl = (path: string): string => {
    // remove any leading slash from the path
    if (path.startsWith('/')) {
        path = path.slice(1)
    }
    return getBaseURL() + path
}

export const getEntityPath = <E extends EntityMinimal>(props: { entityInfo: EntityInfo<E>; entityId?: string; version?: number }): string => {
    const { entityInfo, entityId } = props
    let path = entityInfo.serviceName + '/' + entityInfo.name
    if (entityId) {
        path = path + '/' + entityId
    }
    path = 'v' + (props.version ?? 1) + '/' + path
    return path
}

export interface HTTPRequest<D = any> extends Omit<AxiosRequestConfig<D>, 'method' | 'url'> {
    method: 'GET' | 'POST' | 'PUT'
    path: string
    unauthenticated?: boolean
    // If set, it will be called in case we get an error
    errorCb?: (errMsg: string) => void
}

// Options used during fetch phase.
export interface HTTPFetchRequest<D = any> extends Pick<HTTPRequest<D>, 'data' | 'params'> {}

interface EntityHttpRequest<E extends EntityMinimal, ReqT> extends Omit<HTTPRequest<ReqT>, 'method' | 'path'> {
    entityInfo: EntityInfo<E>
}

export interface AddEntityRequest<E extends EntityMinimal = any> {
    entity: E
}

export const useAddEntity = <E extends EntityMinimal = any>(props: EntityHttpRequest<E, AddEntityRequest<E>>): readonly [HTTPResponse<E>] => {
    const { entityInfo } = props

    console.log('Add Entity: ' + entityInfo.name)

    const [resp, fetch] = useMakeRequest<E, E>({
        ...props,
        method: 'POST',
        path: getEntityPath({ entityInfo: entityInfo }),
        data: props.data?.entity,
    })

    useEffect(() => {
        fetch({})
    }, [])

    return [resp]
}

export interface UpdateEntityRequest<E extends EntityMinimal> {
    object: E
    fields?: EnumFieldFor<E>[]
    exclude_fields?: EnumFieldFor<E>[]
}

export const useUpdateEntity = <E extends EntityMinimal>(props: EntityHttpRequest<E, UpdateEntityRequest<E>>): readonly [HTTPResponse<E>] => {
    const { entityInfo } = props

    console.log('Update Entity: ' + entityInfo.name)

    // fetch data from a url endpoint

    const [resp, fetch] = useMakeRequest<E, UpdateEntityRequest<E>>({
        method: 'PUT',
        path: getEntityPath({
            entityInfo: entityInfo,
            entityId: props.data?.object.id,
        }),
        data: props.data,
    })

    useEffect(() => {
        fetch({})
    }, [props.data])

    return [resp]
}

export interface GetEntityRequest {
    id: UUID
}

export const useGetEntity = <E extends EntityMinimal = any>(props: EntityHttpRequest<E, GetEntityRequest>): readonly [HTTPResponse<E>] => {
    const { entityInfo, data } = props

    console.log('Get Entity: ' + entityInfo.name)

    // fetch data from a url endpoint
    const [resp, fetch] = useMakeRequest<E>({
        method: 'GET',
        path: getEntityPath({ entityInfo: entityInfo }),
        params: { req: data },
    })

    useEffect(() => {
        fetch({})
    }, [])

    return [resp]
}

export interface ListEntityRequest<E extends EntityMinimal> {
    req?: FilterTypeFor<E>
}

export interface ListEntityResponse<E extends EntityMinimal> {
    items: E[]
    // Page: number
    // HasNextPage: boolean
}

export const useListEntity = <E extends EntityMinimal>(props: EntityHttpRequest<E, ListEntityRequest<E>>): readonly [HTTPResponse<ListEntityResponse<E>>] => {
    const { entityInfo } = props

    console.log('List Entity: ' + entityInfo.name)

    // fetch data from a url endpoint
    const [resp, fetch] = useMakeRequest<ListEntityResponse<E>>({
        method: 'GET',
        path: getEntityPath({ entityInfo: entityInfo }) + `/list`,
        params: props.params, // can include any filters here
    })

    useEffect(() => {
        fetch({})
    }, [entityInfo])

    return [resp]
}

export interface ListByTextQueryRequest {
    query_text: string
}

export const useListEntityByTextQuery = <E extends EntityMinimal = any>(
    props: EntityHttpRequest<E, ListByTextQueryRequest>
): readonly [HTTPResponse<ListEntityResponse<E>>, FetchFunc<ListByTextQueryRequest>] => {
    const { entityInfo } = props

    console.log('Query by Text Entity: ' + entityInfo.name)

    // fetch data from a url endpoint
    return useMakeRequest({
        method: 'GET',
        path: getEntityPath({ entityInfo: entityInfo }) + `/query_by_text`,
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

interface GokuHTTPResponse<T = any> {
    data?: T
    error?: string
    status_code: number
}

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

    console.log('useAxios: Making an HTTP call with config', config)
    const url = getUrl(path)
    console.log('useAxios: URL:', url)

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
        console.log('useAxios: result', result)
        return { data: result.data?.data, status_code: result.data?.status_code, error: result.data?.error }
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

        return { error: errMsg, status_code: statusCode }
    }
}

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
        setStatusCode(resp.status_code)
        setLoading(false)
        setFinished(true)
    }

    return [{ statusCode, data, error, loading, finished }, fetch] as const
}
