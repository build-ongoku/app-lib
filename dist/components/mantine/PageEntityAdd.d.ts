import { IEntityMinimal } from '../../common/app_v3';
import React from 'react';
export interface Props {
    params: {
        service: string;
        entity: string;
    };
}
export declare const PageEntityAdd: <E extends IEntityMinimal = any>(props: Props) => React.JSX.Element;
