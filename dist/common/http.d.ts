import { Optional } from './types';
interface Error {
    message: string;
    code?: number;
    userMessage?: string;
    rawError?: any;
}
export interface ActionResponseBody<T = null> extends Optional<ResponseBody<T>, 'status'> {
}
export interface ResponseBody<T = null> {
    data: T | null;
    status: number;
    error?: Error;
}
export declare enum HTTPStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}
export {};
