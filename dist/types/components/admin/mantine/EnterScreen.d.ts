import React from 'react';
export interface EnterScreenProps {
    appName: string;
    authenticatedUserRedirectPath: string;
    unauthenticatedUserRedirectPath: string;
}
export declare const EnterScreen: (props: EnterScreenProps) => React.JSX.Element;
