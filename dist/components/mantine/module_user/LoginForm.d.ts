import React from 'react';
import { Router } from '../../../common/types';
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthenticateResponse {
    token: string;
}
export declare const LoginForm: (props: {
    router: Router;
}) => React.JSX.Element;
