import React from 'react';
interface HeaderAuthenticatedProps {
    opened: boolean;
    toggle: () => void;
    user: any;
}
export declare function HeaderAuthenticated({ opened, toggle, user }: HeaderAuthenticatedProps): React.JSX.Element;
export {};
