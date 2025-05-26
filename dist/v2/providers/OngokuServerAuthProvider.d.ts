import React from 'react';
/**
 * Ongoku Server Auth context interface
 * Provides authentication state with the Ongoku server
 */
export interface OngokuServerAuthState {
    token: string | null;
    isLoading: boolean;
    error: Error | null;
    isAuthenticated: boolean;
    authenticate: (kindeToken: string) => Promise<void>;
}
/**
 * Create a context for the Ongoku server authentication
 */
export declare const OngokuServerAuthContext: React.Context<OngokuServerAuthState>;
/**
 * Ongoku server auth provider props
 */
export interface OngokuServerAuthProviderProps {
    children?: React.ReactNode;
}
/**
 * Provider component for Ongoku server authentication
 * Handles authentication with the Ongoku server using a Kinde token
 */
export declare const OngokuServerAuthProvider: React.FC<OngokuServerAuthProviderProps>;
/**
 * Custom hook to use the Ongoku server auth context
 * Use this to access authentication state and methods throughout the application
 */
export declare const useOngokuServerAuth: () => OngokuServerAuthState;
/**
 * Higher-order component that requires Ongoku server authentication
 * Wraps components that need access to authentication state
 */
export declare function withOngokuServerAuth<P extends object>(Component: React.ComponentType<P & {
    auth: OngokuServerAuthState;
}>): React.FC<P>;
