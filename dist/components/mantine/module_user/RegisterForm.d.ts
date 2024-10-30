import React from 'react';
import { ITypeMinimal } from '../../../common/app_v3';
type BareMinimumRegisterForm = ITypeMinimal & {
    email: string;
};
export declare const RegisterForm: <RequestT extends BareMinimumRegisterForm>(props: {}) => React.JSX.Element;
export {};
