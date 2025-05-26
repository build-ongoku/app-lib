import React from "react";
/**
 * Auth context interface - generic enough to work with any auth provider
 */
export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user?: AuthUser & {
        [key: string]: any;
    };
    authToken?: string;
    authSource: 'kinde' | 'other';
    login?: () => void;
    logout?: () => void;
    register?: () => void;
    getRawAuthState?: () => any;
}
export interface AuthUser {
    id: string;
    email?: string;
    given_name?: string;
}
export declare const AuthContext: React.Context<AuthState>;
/**
 * Hook to access authentication state
 */
export declare const useAuth: () => AuthState;
export interface AuthProviderProps {
    children: React.ReactNode;
    authState: AuthState;
}
/**
 * Provider component for auth context
 * Wraps the application to provide authentication state
 */
export declare const AuthProvider: React.FC<AuthProviderProps>;
