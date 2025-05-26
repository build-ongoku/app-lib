export declare const addBaseURL: (path: string) => string;
export declare const joinURL: (...parts: string[]) => string;
export declare const joinURLNoPrefixSlash: (...parts: string[]) => string;
export interface GokuHTTPResponse<T = any> {
    data?: T;
    error?: string;
    statusCode: number;
}
