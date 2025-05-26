import React from 'react';
import { AuthState } from '../../providers/AuthProvider';
/**
 * Props for NavLink component
 */
export interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}
/**
 * Generic NavLink component to be styled by implementation
 */
export declare const NavLink: React.FC<NavLinkProps>;
/**
 * Props for Navbar component
 */
export interface NavbarAuthenticatedPropsV0 {
    authState: AuthState;
    currentPath: string;
    navLinks: Array<{
        href: string;
        label: string;
    }>;
    LoginButton: React.ReactNode;
    LogoutButton: React.ReactNode;
}
/**
 * Framework-agnostic navbar component
 */
export declare const NavbarAuthenticatedV0: (props: NavbarAuthenticatedPropsV0) => React.JSX.Element;
