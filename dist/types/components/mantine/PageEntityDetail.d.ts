import { IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3';
import React from 'react';
export interface Props {
    params: {
        service: string;
        entity: string;
        identifier: string;
    };
}
export declare const PageEntityDetail: <E extends IEntityMinimal = any>(props: Props) => React.JSX.Element;
