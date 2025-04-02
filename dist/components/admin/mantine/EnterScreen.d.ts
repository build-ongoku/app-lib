import React from 'react';
import { Router } from '../../../common/types';
export interface EnterScreenProps {
    appName: string;
    authenticatedUserRedirectPath: string;
    unauthenticatedUserRedirectPath: string;
    router: Router;
}
export declare const EnterScreen: (props: EnterScreenProps) => React.JSX.Element;
