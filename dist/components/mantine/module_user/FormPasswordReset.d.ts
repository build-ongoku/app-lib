import React from 'react';
import { WithRouter } from '../../../common/types';
interface Props extends WithRouter {
    email: string;
    token: string;
}
export declare const FormPasswordReset: (props: Props) => React.JSX.Element;
export {};
