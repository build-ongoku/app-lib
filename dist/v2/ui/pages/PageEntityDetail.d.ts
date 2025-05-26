import { IEntityMinimal } from '../../core';
import React from 'react';
export interface PageEntityDetailProps {
    params: {
        serviceSlug: string;
        entitySlug: string;
        entityIdentifier: string;
    };
}
export declare const PageEntityDetail: <E extends IEntityMinimal = any>(props: PageEntityDetailProps) => React.JSX.Element;
