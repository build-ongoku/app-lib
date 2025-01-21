import React from 'react';
export interface AuthenticateResponse {
    token: string;
}
export interface AuthenticateTokenRequest {
    token: string;
}
export interface Session {
    token: string;
}
interface DecodedToken {
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    sub: string;
}
export declare const getDetailsFromSession: (session: Session) => DecodedToken;
export declare const getSessionCookie: () => Session | undefined;
export declare const setSessionCookie: (session: Session) => void;
export declare const deleteSessionCookie: () => void;
export declare const verifySessionCookie: () => Promise<boolean>;
export declare const verifyToken: (props: {
    token: string;
}) => Promise<boolean>;
export interface AuthContextData {
    session?: Session;
    authenticate: (token: string) => void;
    endSession: () => void;
    loading?: boolean;
}
export declare const AuthContext: React.Context<AuthContextData | undefined>;
export declare const AuthProvider: (props: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const useAuth: () => AuthContextData;
export {};
