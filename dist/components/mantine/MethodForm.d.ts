import { ITypeMinimal } from '@ongoku/app-lib/src/common/app_v3';
import React from 'react';
export declare const MethodForm: <ReqT extends ITypeMinimal = any, RespT extends ITypeMinimal = any>(props: {
    service: string;
    entity?: string;
    method: string;
}) => React.JSX.Element;
