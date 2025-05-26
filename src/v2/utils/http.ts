import { Optional } from './types'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

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