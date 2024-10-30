import { Optional } from '@ongoku/app-lib/src/common/types'
import { NextRequest, NextResponse } from 'next/server'

interface Error {
    // This is the error message
    message: string
    // This is an optional error code that can be used to identify the error
    code?: number
    // This is an optional user-friendly message that can be displayed to the user
    userMessage?: string
    // This is the original error, if any.
    rawError?: any
}

// ActionResponseBody is the same as ResponseBody but with the status field optional
export interface ActionResponseBody<T = null> extends Optional<ResponseBody<T>, 'status'> {}

export interface ResponseBody<T = null> {
    data: T | null
    status: number
    error?: Error
}

export class CustomNextRequest<T = null> extends NextRequest {
    async json(): Promise<T> {
        const body = await super.json()
        return body as T
    }
}

export class CustomNextResponse<T> extends NextResponse<ResponseBody<T>> {}

// An enum list of all important HTTP status codes
export enum HTTPStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export const handleResponse = <T>(resp: ActionResponseBody<T>): CustomNextResponse<T> => {
    if (resp.error) {
        return CustomNextResponse.json({ ...resp, status: HTTPStatus.BAD_REQUEST })
    }
    return CustomNextResponse.json({ ...resp, status: HTTPStatus.OK })
}
