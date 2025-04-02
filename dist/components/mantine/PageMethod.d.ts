import { WithRouter } from '../../common/types';
import React from 'react';
export interface PropsService {
    params: {
        service: string;
        method: string;
    };
}
export interface PropsEntity {
    params: {
        service: string;
        entity: string;
        method: string;
    };
}
export declare const PageMethod: <P extends (PropsService | PropsEntity) & WithRouter>(props: P) => React.JSX.Element;
