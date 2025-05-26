import React from 'react';
import { IEntityMinimal } from '../../core';
export interface PageEntityListProps {
    params: Promise<{
        serviceSlug: string;
        entitySlug: string;
    }>;
}
export declare const PageEntityList: <E extends IEntityMinimal = any>(props: PageEntityListProps) => React.JSX.Element;
