import { IEntityMinimal } from '../../core/app'
import { Optional } from '../types'
import { useEffect, useState } from 'react'
import { GokuHTTPResponse } from './util'
import { NamespaceReq } from '../../core/namespace'
import { AddEntityRequestData, AddEntityResponseData, getAddEntityMethodAndPath, GetEntityRequestData, GetEntityResponseData, getGetEntityMethodAndPath, getListEntityMethodAndPath, ListEntityRequestData, ListEntityResponseData, makeRequest, MakeRequestProps, QueryByTextEntityRequestData, QueryByTextEntityResponseData } from './common'
import { useOngokuServerAuth } from '../../providers/OngokuServerAuthProvider'

/* * * * * *
 * Make Request
 * * * * * */

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

    // Get auth token
    const { token } = useOngokuServerAuth()

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
        if (token) {
            finalProps.authToken = token
        }
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

interface UseXEntityMakeRequestProps<ReqT = any> extends Omit<UseMakeRequestProps<ReqT>, 'method' | 'relativePath' | 'unauthenticated' | 'url'> {}

interface UseXEntityProps<ReqT = any> extends UseXEntityMakeRequestProps<ReqT> {
    entityNamespace: NamespaceReq
}

/* * * * * *
 * Add Entity
 * * * * * */

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

/* * * * * *
 * Get Entity
 * * * * * */

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
