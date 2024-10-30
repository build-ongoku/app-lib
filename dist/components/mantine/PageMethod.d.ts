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
export declare const PageMethod: <P extends PropsService | PropsEntity>(props: P) => React.JSX.Element;
