import React from 'react';
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthenticateResponse {
    token: string;
}
export declare const LoginForm: () => React.JSX.Element;
