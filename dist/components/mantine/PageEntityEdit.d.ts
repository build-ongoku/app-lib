import { IEntityMinimal } from '../../common/app_v3';
import React from 'react';
export interface Props {
    params: {
        service: string;
        entity: string;
        identifier: string;
    };
}
export declare const PageEntityEdit: <E extends IEntityMinimal = any>(props: Props) => React.JSX.Element;
