import { ITypeMinimal } from '../../common/app_v3';
import React from 'react';
import { Router } from '../../common/types';
export declare const MethodForm: <ReqT extends ITypeMinimal = any, RespT extends ITypeMinimal = any>(props: {
    service: string;
    entity?: string;
    method: string;
    router: Router;
}) => React.JSX.Element;
