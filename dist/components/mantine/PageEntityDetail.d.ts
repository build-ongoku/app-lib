import { IEntityMinimal } from '../../common/app_v3';
import { WithRouter } from '../../common/types';
import React from 'react';
export interface Props {
    params: {
        service: string;
        entity: string;
        identifier: string;
    };
}
export declare const PageEntityDetail: <E extends IEntityMinimal = any>(props: Props & WithRouter) => React.JSX.Element;
